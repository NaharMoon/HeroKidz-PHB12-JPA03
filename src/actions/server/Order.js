"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { clearCart, getCart } from "./cart";
import { sendEmail } from "@/lib/sendEmail";
import { orderInvoiceTemplate } from "@/lib/orderInvoice";
import { adminOrderNotificationTemplate } from "@/lib/AdminInvoice";
import { collections, dbConnect, ensureDatabaseIndexes } from "@/lib/dbConnect";
import { getCurrentSession, requireAdmin } from "@/lib/auth";
import { getBaseUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

const sendOrderEmails = async ({ user, payload, cart, totalPrice, orderId }) => {
  try {
    await sendEmail({
      to: user.email,
      subject: "Your HeroKidz order confirmation",
      html: orderInvoiceTemplate({
        orderId,
        items: cart,
        totalPrice,
      }),
    });

    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: "New order placed on HeroKidz",
        html: adminOrderNotificationTemplate({
          orderId,
          items: cart,
          totalPrice,
          address: payload.address,
          contact: payload.contact,
          name: user.name,
          email: user.email,
          instruction: payload.instruction || "",
        }),
      });
    }
  } catch (error) {
    console.log("Email send failed:", error.message);
  }
};

const revalidateOrderPaths = (orderId) => {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath("/orders");
  if (orderId) revalidatePath(`/orders/${orderId}`);
  revalidatePath("/cart");
  revalidatePath("/checkout");
};

export const createOrder = async (payload) => {
  const session = await getCurrentSession();
  const user = session?.user;
  if (!user?.email) return { success: false, message: "Please login first." };

  await ensureDatabaseIndexes();
  const cart = await getCart();
  if (!cart.length) return { success: false, message: "Your cart is empty." };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orders = await dbConnect(collections.ORDERS);
  const paymentMethod = payload.paymentMethod || "cod";
  const stripeEnabled = isStripeConfigured();

  if (paymentMethod === "stripe" && !stripeEnabled) {
    return {
      success: false,
      message: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PUBLIC_KEY to continue.",
    };
  }

  const newOrder = {
    name: payload.name,
    email: payload.email,
    contact: payload.contact,
    address: payload.address,
    instruction: payload.instruction || "",
    items: cart.map((item) => ({
      ...item,
      _id: item._id,
      productId: item.productId,
    })),
    totalPrice,
    totalItems,
    status: paymentMethod === "stripe" ? "pending_payment" : "pending",
    paymentMethod,
    paymentStatus: paymentMethod === "stripe" ? "awaiting_payment" : "pending",
    userEmail: user.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await orders.insertOne(newOrder);
  if (!result.insertedId) return { success: false, message: "Order could not be created." };

  const orderId = result.insertedId.toString();

  if (paymentMethod === "cod") {
    await clearCart();
    await sendOrderEmails({ user, payload, cart, totalPrice, orderId });
    revalidateOrderPaths(orderId);

    return {
      success: true,
      orderId,
      paymentMethod,
      stripeEnabled,
      redirectTo: "/orders",
    };
  }

  const stripe = getStripe();
  const baseUrl = getBaseUrl();
  const sessionResponse = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: payload.email,
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
    cancel_url: `${baseUrl}/payment/failed?orderId=${orderId}`,
    line_items: cart.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          images: item.image ? [`${baseUrl}${item.image}`] : [],
        },
      },
    })),
    metadata: {
      orderId,
      userEmail: user.email,
      paymentMethod,
    },
  });

  await orders.updateOne(
    { _id: result.insertedId },
    {
      $set: {
        stripeSessionId: sessionResponse.id,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  revalidateOrderPaths(orderId);

  return {
    success: true,
    orderId,
    paymentMethod,
    stripeEnabled,
    redirectTo: sessionResponse.url,
    externalRedirect: true,
  };
};

export const finalizeStripeOrder = async ({ orderId, sessionId }) => {
  const session = await getCurrentSession();
  if (!session?.user?.email || !ObjectId.isValid(orderId) || !sessionId) {
    return { success: false, message: "Invalid payment confirmation request." };
  }

  const orders = await dbConnect(collections.ORDERS);
  const order = await orders.findOne({ _id: new ObjectId(orderId), userEmail: session.user.email });
  if (!order) return { success: false, message: "Order not found." };

  if (order.paymentStatus === "paid") {
    return { success: true, alreadyProcessed: true, orderId };
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (checkoutSession.payment_status !== "paid" || checkoutSession.metadata?.orderId !== orderId) {
    return { success: false, message: "Payment could not be verified." };
  }

  await orders.updateOne(
    { _id: new ObjectId(orderId) },
    {
      $set: {
        status: "processing",
        paymentStatus: "paid",
        paidAt: new Date().toISOString(),
        stripeSessionId: checkoutSession.id,
        stripePaymentIntentId: typeof checkoutSession.payment_intent === "string" ? checkoutSession.payment_intent : "",
        updatedAt: new Date().toISOString(),
      },
    }
  );

  await clearCart();
  await sendOrderEmails({
    user: { name: order.name, email: order.email },
    payload: order,
    cart: order.items,
    totalPrice: order.totalPrice,
    orderId,
  });

  return { success: true, orderId };
};

export const cancelStripeOrder = async (orderId) => {
  const session = await getCurrentSession();
  if (!session?.user?.email || !ObjectId.isValid(orderId)) return { success: false };

  const orders = await dbConnect(collections.ORDERS);
  await orders.updateOne(
    {
      _id: new ObjectId(orderId),
      userEmail: session.user.email,
      paymentMethod: "stripe",
      paymentStatus: { $ne: "paid" },
    },
    {
      $set: {
        status: "cancelled",
        paymentStatus: "cancelled",
        updatedAt: new Date().toISOString(),
      },
    }
  );

  revalidateOrderPaths(orderId);
  return { success: true };
};

export const getOrdersByUser = async () => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email) return [];

  const orders = await dbConnect(collections.ORDERS);
  const result = await orders.find({ userEmail: email }).sort({ createdAt: -1 }).toArray();
  return result.map((order) => ({ ...order, _id: order._id.toString() }));
};

export const getSingleOrder = async (id) => {
  const session = await getCurrentSession();
  if (!session?.user?.email || !ObjectId.isValid(id)) return null;
  const orders = await dbConnect(collections.ORDERS);
  const query = session.user.role === "admin" ? { _id: new ObjectId(id) } : { _id: new ObjectId(id), userEmail: session.user.email };
  const order = await orders.findOne(query);
  return order ? { ...order, _id: order._id.toString() } : null;
};

export const getAllOrders = async () => {
  await requireAdmin();
  const orders = await dbConnect(collections.ORDERS);
  const result = await orders.find().sort({ createdAt: -1 }).toArray();
  return result.map((order) => ({ ...order, _id: order._id.toString() }));
};

export const updateOrderStatus = async (id, status) => {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return { success: false, message: "Invalid order id." };

  const allowed = ["pending", "pending_payment", "processing", "shipped", "delivered", "cancelled"];
  if (!allowed.includes(status)) return { success: false, message: "Invalid status." };

  const orders = await dbConnect(collections.ORDERS);
  const result = await orders.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date().toISOString() } }
  );

  revalidateOrderPaths(id);
  return { success: Boolean(result.modifiedCount) };
};

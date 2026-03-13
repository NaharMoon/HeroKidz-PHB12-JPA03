import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { collections, dbConnect, ensureDatabaseIndexes } from "@/lib/dbConnect";
import { getBaseUrl, getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: "Stripe is not configured." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      email,
      address,
      phone,
      notes,
      items = [],
      subtotal = 0,
      shipping = 0,
      total = 0,
    } = body || {};

    if (!items.length) {
      return NextResponse.json({ error: "No checkout items provided." }, { status: 400 });
    }

    await ensureDatabaseIndexes();
    const ordersCollection = await dbConnect(collections.ORDERS);

    const normalizedItems = items.map((item) => ({
      _id: String(item._id || item.productId || ""),
      productId: String(item.productId || item._id || ""),
      title: item.title || "Product",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || "",
      category: item.category || "",
    }));

    const now = new Date().toISOString();
    const totalItems = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);

    const orderDoc = {
      name: fullName || session.user?.name || "Customer",
      email: email || userEmail,
      contact: phone || "",
      address: address || "",
      instruction: notes || "",
      items: normalizedItems,
      totalPrice: Number(total || 0),
      subtotal: Number(subtotal || 0),
      shipping: Number(shipping || 0),
      totalItems,
      status: "pending_payment",
      paymentMethod: "stripe",
      paymentStatus: "awaiting_payment",
      userEmail,
      createdAt: now,
      updatedAt: now,
    };

    const orderResult = await ordersCollection.insertOne(orderDoc);
    const orderId = orderResult.insertedId.toString();

    const stripe = getStripe();
    const baseUrl = getBaseUrl();
    const currency = "bdt";

    const lineItems = normalizedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: Math.max(100, Math.round(item.price * 100)),
        product_data: {
          name: item.title,
          description: item.category || "HeroKidz product",
        },
      },
    }));

    if (shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: Math.round(Number(shipping) * 100),
          product_data: {
            name: "Shipping",
            description: "Standard delivery charge",
          },
        },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      customer_email: email || userEmail,
      metadata: {
        orderId,
        userEmail,
        paymentMethod: "stripe",
      },
      success_url: `${baseUrl}/payment/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/failed?orderId=${orderId}`,
    });

    await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          stripeSessionId: checkoutSession.id,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    return NextResponse.json({ url: checkoutSession.url, orderId });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Stripe checkout session." },
      { status: 500 }
    );
  }
}

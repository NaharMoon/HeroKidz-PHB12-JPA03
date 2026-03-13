"use server";

import { ObjectId } from "mongodb";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { collections, dbConnect } from "@/lib/dbConnect";
import { getCurrentSession } from "@/lib/auth";

export const handleCart = async (productId) => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email || !ObjectId.isValid(productId)) return { success: false, message: "Please login first." };

  const cartCollection = await dbConnect(collections.CART);
  const productsCollection = await dbConnect(collections.PRODUCTS);
  const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

  if (!product) return { success: false, message: "Product not found." };
  if ((product.stock || 0) <= 0) return { success: false, message: "This product is out of stock." };

  const query = { email, productId: new ObjectId(productId) };
  const existingItem = await cartCollection.findOne(query);

  if (existingItem) {
    if (existingItem.quantity >= Math.min(product.stock || 10, 10)) {
      return { success: false, message: "Maximum allowed quantity reached." };
    }

    const result = await cartCollection.updateOne(query, {
      $inc: { quantity: 1 },
      $set: { updatedAt: new Date().toISOString() },
    });

    revalidatePath("/", "layout");
    revalidatePath("/cart");
    revalidatePath("/checkout");
    return { success: Boolean(result.modifiedCount) };
  }

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const result = await cartCollection.insertOne({
    productId: product._id,
    email,
    title: product.title,
    image: product.image,
    quantity: 1,
    unitPrice: product.price,
    price: discountedPrice,
    username: session.user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: result.acknowledged };
};

// cache issue----------------------!
// export const getCart = cache(async () => {
//   const session = await getCurrentSession();
//   const email = session?.user?.email;
//   if (!email) return [];

//   const cartCollection = await dbConnect(collections.CART);
//   const result = await cartCollection.find({ email }).sort({ createdAt: -1 }).toArray();
//   return result.map((item) => ({ ...item, _id: item._id.toString(), productId: item.productId.toString() }));
// });

export const getCart = async () => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email) return [];

  const cartCollection = await dbConnect(collections.CART);
  const result = await cartCollection.find({ email }).sort({ createdAt: -1 }).toArray();

  return result.map((item) => ({
    ...item,
    _id: item._id.toString(),
    productId: item.productId.toString(),
  }));
};

export const deleteItemsFromCart = async (id) => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email || !ObjectId.isValid(id)) return { success: false };

  const cartCollection = await dbConnect(collections.CART);
  const result = await cartCollection.deleteOne({ _id: new ObjectId(id), email });
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: Boolean(result.deletedCount) };
};

export const increaseItemDb = async (id, quantity) => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email || !ObjectId.isValid(id)) return { success: false };
  if (quantity >= 10) return { success: false, message: "You can buy up to 10 units only." };

  const cartCollection = await dbConnect(collections.CART);
  const result = await cartCollection.updateOne(
    { _id: new ObjectId(id), email },
    { $inc: { quantity: 1 }, $set: { updatedAt: new Date().toISOString() } }
  );
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: Boolean(result.modifiedCount) };
};

export const decreaseItemDb = async (id, quantity) => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email || !ObjectId.isValid(id)) return { success: false };
  if (quantity <= 1) return { success: false, message: "Quantity cannot be less than 1." };

  const cartCollection = await dbConnect(collections.CART);
  const result = await cartCollection.updateOne(
    { _id: new ObjectId(id), email },
    { $inc: { quantity: -1 }, $set: { updatedAt: new Date().toISOString() } }
  );
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
  return { success: Boolean(result.modifiedCount) };
};

export const clearCart = async () => {
  const session = await getCurrentSession();
  const email = session?.user?.email;
  if (!email) return { success: false };

  const cartCollection = await dbConnect(collections.CART);
  const result = await cartCollection.deleteMany({ email });
  return { success: Boolean(result.acknowledged) };
};

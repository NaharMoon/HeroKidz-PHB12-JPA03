"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { collections, dbConnect, ensureDatabaseIndexes } from "@/lib/dbConnect";
import { getCurrentSession } from "@/lib/auth";

export const getWishlist = async () => {
  const session = await getCurrentSession();
  if (!session?.user?.email) return [];

  await ensureDatabaseIndexes();
  const wishlist = await dbConnect(collections.WISHLIST);
  const result = await wishlist.find({ email: session.user.email }).sort({ createdAt: -1 }).toArray();
  return result.map((item) => ({ ...item, _id: item._id.toString(), productId: item.productId.toString() }));
};

export const isWishlisted = async (productId) => {
  const session = await getCurrentSession();
  if (!session?.user?.email || !ObjectId.isValid(productId)) return false;
  const wishlist = await dbConnect(collections.WISHLIST);
  const item = await wishlist.findOne({ email: session.user.email, productId: new ObjectId(productId) });
  return Boolean(item);
};

export const toggleWishlist = async (product) => {
  const session = await getCurrentSession();
  if (!session?.user?.email) return { success: false, message: "Please login first." };
  if (!ObjectId.isValid(product?._id)) return { success: false, message: "Invalid product." };

  await ensureDatabaseIndexes();
  const wishlist = await dbConnect(collections.WISHLIST);
  const query = { email: session.user.email, productId: new ObjectId(product._id) };
  const existing = await wishlist.findOne(query);

  if (existing) {
    await wishlist.deleteOne(query);
    revalidatePath("/", "layout");
    revalidatePath("/wishlist");
    revalidatePath(`/products/${product._id}`);
    return { success: true, active: false, message: "Removed from wishlist." };
  }

  await wishlist.insertOne({
    email: session.user.email,
    productId: new ObjectId(product._id),
    title: product.title,
    image: product.image,
    category: product.category,
    price: product.price,
    discount: product.discount || 0,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/", "layout");
  revalidatePath("/wishlist");
  revalidatePath(`/products/${product._id}`);
  return { success: true, active: true, message: "Added to wishlist." };
};

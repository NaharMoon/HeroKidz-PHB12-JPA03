"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { collections, dbConnect, ensureDatabaseIndexes } from "@/lib/dbConnect";
import { getCurrentSession } from "@/lib/auth";

export const addReview = async ({ productId, rating, title, message }) => {
  const session = await getCurrentSession();
  if (!session?.user?.email) return { success: false, message: "Please login first." };
  if (!productId || !ObjectId.isValid(productId)) return { success: false, message: "Product id is required." };

  const safeRating = Number(rating);
  if (Number.isNaN(safeRating) || safeRating < 1 || safeRating > 5) {
    return { success: false, message: "Rating must be between 1 and 5." };
  }

  await ensureDatabaseIndexes();
  const reviews = await dbConnect(collections.REVIEWS);
  const products = await dbConnect(collections.PRODUCTS);
  const orders = await dbConnect(collections.ORDERS);

  const purchased = await orders.findOne({ userEmail: session.user.email, "items.productId": productId });
  if (!purchased) {
    return { success: false, message: "Only customers who ordered this product can review it." };
  }

  await reviews.updateOne(
    { productId, email: session.user.email },
    {
      $set: {
        productId,
        email: session.user.email,
        userName: session.user.name || "Verified Buyer",
        rating: safeRating,
        title: String(title || "").trim(),
        message: String(message || "").trim(),
        updatedAt: new Date().toISOString(),
      },
      $setOnInsert: {
        createdAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );

  const stats = await reviews
    .aggregate([
      { $match: { productId } },
      { $group: { _id: "$productId", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    ])
    .toArray();

  await products.updateOne(
    { _id: new ObjectId(productId) },
    {
      $set: {
        ratings: Number((stats[0]?.averageRating || 0).toFixed(1)),
        reviews: stats[0]?.totalReviews || 0,
        updatedAt: new Date().toISOString(),
      },
    }
  );

  revalidatePath(`/products/${productId}`);
  return { success: true, message: "Review submitted successfully." };
};

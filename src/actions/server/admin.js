"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { collections, dbConnect } from "@/lib/dbConnect";

export const getDashboardStats = async () => {
  await requireAdmin();
  const [usersCollection, productsCollection, ordersCollection, reviewsCollection] = await Promise.all([
    dbConnect(collections.USERS),
    dbConnect(collections.PRODUCTS),
    dbConnect(collections.ORDERS),
    dbConnect(collections.REVIEWS),
  ]);

  const [totalUsers, totalProducts, totalOrders, totalReviews, revenueAgg, orderBreakdown] = await Promise.all([
    usersCollection.countDocuments(),
    productsCollection.countDocuments(),
    ordersCollection.countDocuments(),
    reviewsCollection.countDocuments(),
    ordersCollection
      .aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
      ])
      .toArray(),
    ordersCollection
      .aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalReviews,
    estimatedRevenue: revenueAgg[0]?.revenue || 0,
    orderBreakdown,
  };
};

export const getAllUsers = async () => {
  await requireAdmin();
  const users = await dbConnect(collections.USERS);
  const result = await users.find().sort({ createdAt: -1 }).toArray();
  return result.map((user) => ({ ...user, _id: user._id.toString(), password: undefined }));
};

export const updateUserRole = async (id, role) => {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return { success: false, message: "Invalid user id." };
  if (!["admin", "user"].includes(role)) return { success: false, message: "Invalid role." };

  const users = await dbConnect(collections.USERS);
  const result = await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: { role, updatedAt: new Date().toISOString() } }
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/users");
  return { success: Boolean(result.modifiedCount) };
};

"use server";

import bcrypt from "bcryptjs";
import { collections, dbConnect } from "@/lib/dbConnect";
import { revalidatePath } from "next/cache";

export const postUser = async (payload) => {
  const { email, password, name } = payload || {};

  if (!email || !password || !name) {
    return { success: false, message: "All fields are required." };
  }

  const users = await dbConnect(collections.USERS);
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    return { success: false, message: "An account already exists with this email." };
  }

  const newUser = {
    provider: "credentials",
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: await bcrypt.hash(password, 12),
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await users.insertOne(newUser);
  revalidatePath("/dashboard/users");

  return {
    success: result.acknowledged,
    insertedId: result.insertedId?.toString(),
  };
};

export const loginUser = async (payload) => {
  const { email, password } = payload || {};
  if (!email || !password) return null;

  const users = await dbConnect(collections.USERS);
  const user = await users.findOne({ email: email.trim().toLowerCase() });
  if (!user?.password) return null;

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role || "user",
    image: user.image || "",
  };
};

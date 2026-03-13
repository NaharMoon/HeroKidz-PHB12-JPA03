import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { collections, dbConnect } from "@/lib/dbConnect";

export const getCurrentSession = async () => {
  return (await getServerSession(authOptions)) || null;
};

export const getCurrentUser = async () => {
  const session = await getCurrentSession();
  if (!session?.user?.email) return null;

  const users = await dbConnect(collections.USERS);
  const user = await users.findOne({ email: session.user.email });

  return user
    ? {
        ...user,
        _id: user._id.toString(),
      }
    : null;
};

export const requireAuth = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
};

export const requireAdmin = async () => {
  const user = await requireAuth();
  if (user.role !== "admin") redirect("/");
  return user;
};

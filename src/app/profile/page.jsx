import Link from "next/link";
import { getOrdersByUser } from "@/actions/server/Order";
import { getWishlist } from "@/actions/server/wishlist";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import { formatCompactNumber, formatCurrency, formatDate } from "@/lib/format";

export const metadata = {
  title: "Profile",
};

const ProfilePage = async () => {
  await requireAuth();
  const [user, orders, wishlist] = await Promise.all([getCurrentUser(), getOrdersByUser(), getWishlist()]);
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-base-300 bg-base-100 p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Account Area</p>
        <h1 className="mt-3 text-4xl font-bold">{user?.name || "User Profile"}</h1>
        <p className="mt-2 text-base-content/60">{user?.email}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-base-200 p-4"><p className="text-sm text-base-content/60">Orders</p><p className="mt-2 text-3xl font-bold">{formatCompactNumber(orders.length)}</p></div>
          <div className="rounded-2xl bg-base-200 p-4"><p className="text-sm text-base-content/60">Wishlist</p><p className="mt-2 text-3xl font-bold">{formatCompactNumber(wishlist.length)}</p></div>
          <div className="rounded-2xl bg-base-200 p-4"><p className="text-sm text-base-content/60">Lifetime Spend</p><p className="mt-2 text-3xl font-bold text-primary">{formatCurrency(totalSpent)}</p></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Link href="/orders" className="btn btn-sm btn-outline">View All</Link>
          </div>
          <div className="mt-5 space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div key={order._id} className="rounded-2xl bg-base-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-base-content/60">{formatDate(order.createdAt)}</p>
                  </div>
                  <p className="font-semibold text-primary">{formatCurrency(order.totalPrice)}</p>
                </div>
              </div>
            ))}
            {!orders.length ? <div className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/60">No orders yet.</div> : null}
          </div>
        </div>

        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">Saved Wishlist</h2>
            <Link href="/wishlist" className="btn btn-sm btn-outline">View Wishlist</Link>
          </div>
          <div className="mt-5 space-y-4">
            {wishlist.slice(0, 4).map((item) => (
              <div key={item._id} className="rounded-2xl bg-base-200 p-4">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-base-content/60">{item.category}</p>
              </div>
            ))}
            {!wishlist.length ? <div className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/60">No wishlist items saved.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

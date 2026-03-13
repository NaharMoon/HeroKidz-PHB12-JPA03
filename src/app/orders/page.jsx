import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getOrdersByUser } from "@/actions/server/Order";
import { formatCurrency, formatDate, getStatusTone } from "@/lib/format";
import EmptyState from "@/components/ui/EmptyState";

export const metadata = {
  title: "Order History",
};

const OrdersPage = async () => {
  await requireAuth();
  const orders = await getOrdersByUser();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">My Orders</h1>
        <p className="text-base-content/60">Track your previous purchases and their current status.</p>
      </div>

      {!orders.length ? (
        <EmptyState title="No orders yet" description="Your order history will appear here after checkout." actionLabel="Shop now" />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order._id} className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="text-sm text-base-content/60">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${getStatusTone(order.status)}`}>{order.status}</span>
                  <span className="text-lg font-bold text-primary">{formatCurrency(order.totalPrice)}</span>
                  <Link href={`/orders/${order._id}`} className="btn btn-sm btn-outline">Details</Link>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {order.items.slice(0, 4).map((item, index) => (
                  <div key={`${order._id}-${item.productId || item._id || item.title}-${index}`} className="rounded-2xl bg-base-200 p-4 text-sm">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-base-content/60">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

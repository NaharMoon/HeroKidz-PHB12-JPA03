import { getAllOrders } from "@/actions/server/Order";
import OrderStatusSelect from "@/components/dashboard/OrderStatusSelect";
import { formatCurrency, formatDate } from "@/lib/format";

export const metadata = {
  title: "Manage Orders",
};

const DashboardOrdersPage = async () => {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Order Management</h1>
        <p className="mt-2 text-base-content/60">Review basic order details and update fulfillment status.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h2>
                <p className="text-sm text-base-content/60">{order.name} · {order.email} · {formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-primary">{formatCurrency(order.totalPrice)}</span>
                <OrderStatusSelect orderId={order._id} currentStatus={order.status} />
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {order.items.map((item) => (
                <div key={item._id} className="rounded-2xl bg-base-200 p-4 text-sm">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-base-content/60">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-base-content/70">
              <p><span className="font-semibold">Address:</span> {order.address}</p>
              <p><span className="font-semibold">Contact:</span> {order.contact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOrdersPage;

import { notFound } from "next/navigation";
import { getSingleOrder } from "@/actions/server/Order";
import { formatCurrency, formatDate, getStatusTone } from "@/lib/format";

export const metadata = {
  title: "Order Details",
};

const OrderDetailsPage = async ({ params }) => {
  const { id } = await params;
  const order = await getSingleOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Order #{order._id.slice(-6).toUpperCase()}</h1>
          <p className="mt-2 text-base-content/60">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${getStatusTone(order.status)}`}>{order.status}</span>
          <span className="badge badge-outline">{order.paymentMethod || "cod"}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Items</h2>
          <div className="mt-5 space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between gap-4 rounded-2xl bg-base-200 p-4">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-base-content/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Name</span><span>{order.name}</span></div>
            <div className="flex justify-between"><span>Email</span><span>{order.email}</span></div>
            <div className="flex justify-between"><span>Contact</span><span>{order.contact}</span></div>
            <div className="flex justify-between"><span>Total Items</span><span>{order.totalItems}</span></div>
            <div className="flex justify-between text-base font-bold"><span>Total</span><span className="text-primary">{formatCurrency(order.totalPrice)}</span></div>
          </div>
          <div className="rounded-2xl bg-base-200 p-4 text-sm text-base-content/70">
            <p className="font-semibold text-base-content">Delivery Address</p>
            <p className="mt-2">{order.address}</p>
            {order.instruction ? <p className="mt-3"><span className="font-semibold">Instruction:</span> {order.instruction}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

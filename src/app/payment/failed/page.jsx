import Link from "next/link";
import { cancelStripeOrder } from "@/actions/server/Order";

export const metadata = { title: "Payment Cancelled" };

const PaymentFailedPage = async ({ searchParams }) => {
  const params = await searchParams;
  const orderId = params?.orderId;

  if (orderId) {
    await cancelStripeOrder(orderId);
  }

  return (
    <div className="rounded-[2rem] border border-base-300 bg-base-100 p-10 text-center shadow-sm">
      <h1 className="text-4xl font-bold text-warning">Payment not completed</h1>
      <p className="mt-3 text-base-content/65">Your Stripe checkout was cancelled before payment finished. You can return to checkout and try again whenever you are ready.</p>
      {orderId ? <p className="mt-4 text-sm text-base-content/60">Order ID: {orderId}</p> : null}
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/checkout" className="btn btn-primary">Back to Checkout</Link>
        <Link href="/orders" className="btn btn-outline">View Orders</Link>
      </div>
    </div>
  );
};

export default PaymentFailedPage;

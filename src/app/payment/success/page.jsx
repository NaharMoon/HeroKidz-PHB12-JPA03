import Link from "next/link";
import { finalizeStripeOrder } from "@/actions/server/Order";
import RefreshOnMount from "@/components/ui/RefreshOnMount";

export const metadata = { title: "Payment Success" };

const PaymentSuccessPage = async ({ searchParams }) => {
  const params = await searchParams;
  const sessionId = params?.session_id;
  const orderId = params?.orderId;
  const result = sessionId && orderId ? await finalizeStripeOrder({ orderId, sessionId }) : { success: false };

  return (
    <div className="rounded-[2rem] border border-base-300 bg-base-100 p-10 text-center shadow-sm">
      <RefreshOnMount></RefreshOnMount>
      <h1 className="text-4xl font-bold text-success">Payment successful</h1>
      <p className="mt-3 text-base-content/65">
        {result.success
          ? "Your Stripe payment was verified and your order is now being prepared."
          : "We could not verify the payment automatically. Please check your order history or contact support."}
      </p>
      {orderId ? <p className="mt-4 text-sm text-base-content/60">Order ID: {orderId}</p> : null}
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/orders" className="btn btn-primary">View Orders</Link>
        <Link href="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

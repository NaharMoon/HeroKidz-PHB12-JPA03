import { getCart } from "@/actions/server/cart";
import CheckOut from "@/components/home/CheckOut";
import EmptyState from "@/components/ui/EmptyState";

const CheckoutPage = async () => {
  const cartItems = await getCart();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Checkout</h1>
        <p className="text-base-content/60">Confirm delivery information, choose payment method, and place your order.</p>
      </div>

      {!cartItems.length ? (
        <EmptyState
          title="No items selected"
          description="Your cart is empty, so checkout cannot continue yet."
          actionLabel="Browse Products"
        />
      ) : (
        <CheckOut cartItems={cartItems} />
      )}
    </div>
  );
};

export default CheckoutPage;

import { getCart } from "@/actions/server/cart";
import Cart from "@/components/home/Cart";
import EmptyState from "@/components/ui/EmptyState";

const CartPage = async () => {
  const cartItems = await getCart();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">My Cart</h1>
        <p className="text-base-content/60">Review your items, update quantity, and move smoothly to checkout.</p>
      </div>

      {!cartItems.length ? (
        <EmptyState
          title="Your cart is empty"
          description="Add some educational toys to continue shopping and unlock the full checkout flow."
          actionLabel="Browse Products"
        />
      ) : (
        <Cart cartItem={cartItems} />
      )}
    </div>
  );
};

export default CartPage;

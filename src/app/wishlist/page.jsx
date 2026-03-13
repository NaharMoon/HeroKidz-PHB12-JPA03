import Link from "next/link";
import { getWishlist } from "@/actions/server/wishlist";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, getDiscountedPrice } from "@/lib/format";

export const metadata = {
  title: "Wishlist",
};

const WishlistPage = async () => {
  const items = await getWishlist();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Wishlist</h1>
        <p className="mt-2 text-base-content/60">Save favorite products and come back to them later.</p>
      </div>

      {!items.length ? (
        <EmptyState title="Wishlist is empty" description="Save products you love and they will appear here." actionLabel="Explore Products" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link key={item._id} href={`/products/${item.productId}`} className="rounded-[2rem] border border-base-300 bg-base-100 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/50">{item.category}</p>
              <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
              <p className="mt-4 text-primary font-semibold">{formatCurrency(getDiscountedPrice(item.price, item.discount || 0))}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

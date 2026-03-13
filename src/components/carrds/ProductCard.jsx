import Image from "next/image";
import Link from "next/link";
import CartButton from "../buttons/CartButton";
import WishlistButton from "@/components/store/WishlistButton";
import { formatCurrency, getDiscountedPrice } from "@/lib/format";
import StarRating from "@/components/ui/StarRating";

const ProductCard = ({ product }) => {
  const { title, image, price, discount = 0, ratings = 4.5, reviews = 0, sold = 0, stock = 0, badge, category, _id } = product;
  const discountedPrice = getDiscountedPrice(price, discount);

  return (
    <div className="card h-full overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <figure className="relative overflow-hidden bg-base-200 p-5">
        {badge ? <span className="badge badge-primary absolute left-4 top-4 z-10">{badge}</span> : null}
        <Image width={320} height={260} src={image} alt={title} className="h-56 w-full rounded-xl object-cover transition duration-300 hover:scale-[1.03]" />
      </figure>

      <div className="card-body gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-base-content/60">{category || "Educational Toy"}</p>
          <h2 className="card-title line-clamp-2 text-lg">{title}</h2>
        </div>

        <div className="flex items-center justify-between text-sm text-base-content/70">
          <StarRating value={ratings} small />
          <span>{sold} sold</span>
        </div>
        <p className="text-xs text-base-content/60">{reviews} review(s)</p>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-primary">{formatCurrency(discountedPrice)}</p>
            {discount > 0 ? <p className="text-sm text-base-content/50 line-through">{formatCurrency(price)}</p> : null}
          </div>
          <span className={`badge ${stock > 0 ? "badge-success badge-outline" : "badge-error badge-outline"}`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>

        <div className="mt-auto space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <CartButton product={{ ...product, _id: _id.toString() }} />
            <WishlistButton product={{ ...product, _id: _id.toString() }} fullWidth />
          </div>
          <Link href={`/products/${_id}`} className="btn btn-outline btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

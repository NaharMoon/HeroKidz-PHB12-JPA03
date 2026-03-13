import { notFound } from "next/navigation";
import CartButton from "@/components/buttons/CartButton";
import ProductCard from "@/components/carrds/ProductCard";
import ProductGallery from "@/components/store/ProductGallery";
import ReviewSection from "@/components/store/ReviewSection";
import WishlistButton from "@/components/store/WishlistButton";
import StarRating from "@/components/ui/StarRating";
import { getRelatedProducts, getSingleProduct } from "@/actions/server/product";
import { isWishlisted } from "@/actions/server/wishlist";
import { formatCurrency, getDiscountedPrice } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.description?.slice(0, 155),
  };
}

const ProductDetails = async ({ params }) => {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product, 4);
  const wishlisted = await isWishlisted(id);
  const discountedPrice = getDiscountedPrice(product.price, product.discount || 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <ProductGallery images={product.gallery?.length ? product.gallery : [product.image]} title={product.title} />

        <div className="space-y-6 rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="space-y-2">
            <span className="badge badge-primary badge-outline">{product.category || "Educational Toy"}</span>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-sm text-base-content/60">Recommended age: {product.ageRange || "3-6 years"}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70">
            <StarRating value={product.ratings || 4.5} />
            <span>{product.reviews} reviews</span>
            <span>{product.sold} sold</span>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary">{formatCurrency(discountedPrice)}</p>
            {product.discount > 0 ? <p className="text-base-content/50 line-through">{formatCurrency(product.price)}</p> : null}
            <p className={`text-sm font-medium ${product.stock > 0 ? "text-success" : "text-error"}`}>
              {product.stock > 0 ? `${product.stock} items available` : "Currently out of stock"}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <CartButton product={product} />
            <WishlistButton product={product} initialActive={wishlisted} fullWidth />
          </div>

          <div className="grid gap-3 rounded-2xl bg-base-200/70 p-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-base-content/50">Brand</p>
              <p className="mt-1 font-semibold">{product.brand || "HeroKidz"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-base-content/50">Badge</p>
              <p className="mt-1 font-semibold">{product.badge || "Featured"}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-base-200/70 p-5">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <ul className="list-disc space-y-2 pl-5 text-base-content/75">
              {product.info?.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <section className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
        <h3 className="text-2xl font-bold">Description</h3>
        <div className="mt-4 space-y-4 leading-7 text-base-content/75">
          {product.description?.split("\n\n").map((para, idx) => <p key={idx}>{para}</p>)}
        </div>
      </section>

      {product.qna?.length ? (
        <section className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <h3 className="text-2xl font-bold">Questions & Answers</h3>
          <div className="mt-4 space-y-3">
            {product.qna.map((item, i) => (
              <div key={i} className="rounded-2xl border border-base-300 p-4">
                <p className="font-semibold">Q: {item.question}</p>
                <p className="mt-2 text-base-content/70">A: {item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <ReviewSection
        productId={product._id}
        reviews={product.reviewList || []}
        averageRating={product.ratings || 0}
        totalReviews={product.reviews || 0}
      />

      {relatedProducts.length ? (
        <section className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold">Related Products</h3>
            <p className="mt-2 text-base-content/60">More picks from the same category.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ProductDetails;

import ProductCard from "../carrds/ProductCard";
import { getProducts } from "@/actions/server/product";
import SectionHeader from "@/components/ui/SectionHeader";

const Products = async ({ featuredOnly = false }) => {
  const products = await getProducts({ featuredOnly });

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow={featuredOnly ? "Featured Picks" : "Shop Collection"}
        title={featuredOnly ? "Popular learning toys for curious kids" : "Browse the HeroKidz collection"}
        description={featuredOnly ? "Top-rated toys, creative activity kits, and thoughtful gift ideas chosen for playful learning." : "Shop educational toys by age, interest, and category to find the perfect match for every little learner."}
      />

      {products.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-10 text-center text-base-content/70">
          No products available yet. Run the seed script to populate demo data.
        </div>
      )}
    </div>
  );
};

export default Products;

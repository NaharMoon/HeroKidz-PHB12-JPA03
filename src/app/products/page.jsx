import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/carrds/ProductCard";
import Pagination from "@/components/store/Pagination";
import ProductsToolbar from "@/components/store/ProductsToolbar";
import { getProductCategories, getProductsCatalog } from "@/actions/server/product";

export const metadata = {
  title: "Products",
  description: "Browse, search, filter, and sort all learning toys available on HeroKidz.",
};

const ProductsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const categories = await getProductCategories();
  const catalog = await getProductsCatalog({
    query: params?.query || "",
    category: params?.category || "",
    minPrice: params?.minPrice || "",
    maxPrice: params?.maxPrice || "",
    sort: params?.sort || "newest",
    page,
    limit: 8,
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Store Catalog"
        title="Search, filter, and explore the HeroKidz product range"
        description="This upgraded storefront supports category filtering, price range filtering, sorting, pagination, and product detail discovery."
      />

      <ProductsToolbar categories={categories} searchParams={params || {}} />

      {catalog.products.length ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {catalog.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={catalog.page} totalPages={catalog.totalPages} searchParams={params || {}} />
        </>
      ) : (
        <EmptyState
          title="No matching products found"
          description="Try adjusting your search, category, or price range to see more items."
          actionLabel="Reset Filters"
          actionHref="/products"
        />
      )}
    </div>
  );
};

export default ProductsPage;

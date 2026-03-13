import Link from "next/link";

const ProductsToolbar = ({ categories = [], searchParams = {} }) => {
  const current = {
    query: searchParams.query || "",
    category: searchParams.category || "",
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    sort: searchParams.sort || "newest",
  };

  return (
    <form className="grid gap-4 rounded-[2rem] border border-base-300 bg-base-100 p-5 shadow-sm lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]">
      <input name="query" defaultValue={current.query} className="input input-bordered w-full" placeholder="Search toys, categories, badges..." />
      <select name="category" defaultValue={current.category} className="select select-bordered w-full">
        <option value="">All categories</option>
        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </select>
      <input name="minPrice" type="number" defaultValue={current.minPrice} className="input input-bordered w-full" placeholder="Min price" />
      <input name="maxPrice" type="number" defaultValue={current.maxPrice} className="input input-bordered w-full" placeholder="Max price" />
      <select name="sort" defaultValue={current.sort} className="select select-bordered w-full">
        <option value="newest">Newest</option>
        <option value="popular">Popularity</option>
        <option value="rating">Top rated</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
      <div className="flex gap-2">
        <button className="btn btn-primary">Apply</button>
        <Link href="/products" className="btn btn-ghost">Reset</Link>
      </div>
    </form>
  );
};

export default ProductsToolbar;

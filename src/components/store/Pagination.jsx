import Link from "next/link";

const Pagination = ({ page = 1, totalPages = 1, searchParams = {} }) => {
  if (totalPages <= 1) return null;

  const buildHref = (nextPage) => {
    const params = new URLSearchParams();
    Object.entries({ ...searchParams, page: nextPage }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return `/products?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Link href={buildHref(Math.max(1, page - 1))} className={`btn btn-sm ${page === 1 ? "btn-disabled" : "btn-outline"}`}>Prev</Link>
      {pages.map((item) => (
        <Link key={item} href={buildHref(item)} className={`btn btn-sm ${item === page ? "btn-primary" : "btn-ghost"}`}>{item}</Link>
      ))}
      <Link href={buildHref(Math.min(totalPages, page + 1))} className={`btn btn-sm ${page === totalPages ? "btn-disabled" : "btn-outline"}`}>Next</Link>
    </div>
  );
};

export default Pagination;

import Link from "next/link";

const EmptyState = ({ title, description, actionLabel, actionHref = "/products" }) => {
  return (
    <div className="rounded-[2rem] border border-dashed border-base-300 bg-base-100 py-20 text-center">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-base-content/60">{description}</p>
      {actionLabel ? (
        <Link href={actionHref} className="btn btn-primary mt-6">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;

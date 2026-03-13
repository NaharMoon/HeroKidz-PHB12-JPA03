import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

const DashboardLayout = async ({ children }) => {
  await requireAdmin();

  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/products", label: "Products" },
    { href: "/dashboard/orders", label: "Orders" },
    { href: "/dashboard/users", label: "Users" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-[2rem] border border-base-300 bg-base-100 p-5 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="mt-2 text-sm text-base-content/60">Manage products, orders, and user roles.</p>
        <nav className="mt-6 flex flex-col gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 transition hover:bg-base-200 hover:text-base-content">
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;

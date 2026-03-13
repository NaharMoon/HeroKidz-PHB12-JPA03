import StatCard from "@/components/dashboard/StatCard";
import { getDashboardStats } from "@/actions/server/admin";
import { formatCurrency } from "@/lib/format";

export const metadata = { title: "Dashboard" };

const DashboardPage = async () => {
  const stats = await getDashboardStats();
  const max = Math.max(...stats.orderBreakdown.map((item) => item.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard Overview</h1>
        <p className="mt-2 text-base-content/60">Quick snapshot of store activity, customer engagement, and revenue signals.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} helpText="Registered accounts in the users collection." />
        <StatCard label="Total Products" value={stats.totalProducts} helpText="Products visible in the store and admin inventory." />
        <StatCard label="Total Orders" value={stats.totalOrders} helpText="Orders captured through the checkout flow." />
        <StatCard label="Revenue Estimate" value={formatCurrency(stats.estimatedRevenue)} helpText="Non-cancelled order value." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Order Status Analytics</h2>
              <p className="mt-1 text-sm text-base-content/60">Simple dashboard visualization without extra chart libraries.</p>
            </div>
            <span className="badge badge-outline">{stats.totalOrders} orders</span>
          </div>
          <div className="mt-6 space-y-4">
            {stats.orderBreakdown.map((item) => (
              <div key={item._id}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium capitalize">{item._id}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-3 rounded-full bg-base-200">
                  <div className="h-3 rounded-full bg-primary" style={{ width: `${(item.count / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Engagement</h2>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl bg-base-200 p-4">
              <p className="text-sm text-base-content/60">Reviews Collected</p>
              <p className="mt-2 text-3xl font-bold">{stats.totalReviews}</p>
            </div>
            <div className="rounded-2xl bg-base-200 p-4">
              <p className="text-sm text-base-content/60">Conversion Stack</p>
              <p className="mt-2 text-sm leading-6 text-base-content/70">Wishlist, review system, cart, checkout, and order history create a realistic ecommerce portfolio experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

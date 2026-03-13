import Link from "next/link";
import { getProducts } from "@/actions/server/product";
import { formatCurrency, formatDate } from "@/lib/format";
import DeleteProductButton from "@/components/dashboard/DeleteProductButton";

export const metadata = {
  title: "Manage Products",
};

const DashboardProductsPage = async () => {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Product Management</h1>
          <p className="mt-2 text-base-content/60">Create, update, and remove products from the store catalog.</p>
        </div>
        <Link href="/dashboard/products/new" className="btn btn-primary">Add Product</Link>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-base-300 bg-base-100 shadow-sm">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <div>
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-xs text-base-content/60">{product.category}</p>
                  </div>
                </td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.stock}</td>
                <td>{product.featured ? "Yes" : "No"}</td>
                <td>{formatDate(product.updatedAt || product.createdAt)}</td>
                <td>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/products/${product._id}/edit`} className="btn btn-sm btn-outline">Edit</Link>
                    <DeleteProductButton productId={product._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProductsPage;

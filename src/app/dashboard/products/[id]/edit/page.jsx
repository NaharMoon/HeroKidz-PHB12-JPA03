import { notFound } from "next/navigation";
import ProductForm from "@/components/dashboard/ProductForm";
import { getSingleProduct } from "@/actions/server/product";

export const metadata = {
  title: "Edit Product",
};

const EditProductPage = async ({ params }) => {
  const { id } = await params;
  const product = await getSingleProduct(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Edit Product</h1>
        <p className="mt-2 text-base-content/60">Update catalog information without changing the overall project structure.</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
};

export default EditProductPage;

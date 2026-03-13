import ProductForm from "@/components/dashboard/ProductForm";

export const metadata = {
  title: "Add Product",
};

const NewProductPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Add New Product</h1>
        <p className="mt-2 text-base-content/60">Create a new catalog item for HeroKidz.</p>
      </div>
      <ProductForm />
    </div>
  );
};

export default NewProductPage;

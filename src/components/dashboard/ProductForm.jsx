"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { createProduct, updateProduct } from "@/actions/server/product";

const ProductForm = ({ product = null }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    const payload = {
      title: form.title.value,
      image: form.image.value,
      gallery: form.gallery.value,
      category: form.category.value,
      ageRange: form.ageRange.value,
      brand: form.brand.value,
      price: form.price.value,
      discount: form.discount.value,
      stock: form.stock.value,
      ratings: form.ratings.value,
      reviews: form.reviews.value,
      sold: form.sold.value,
      badge: form.badge.value,
      description: form.description.value,
      info: form.info.value,
      featured: form.featured.checked,
      qna: product?.qna || [],
    };

    const result = product?._id ? await updateProduct(product._id, payload) : await createProduct(payload);
    setLoading(false);

    if (!result.success) {
      Swal.fire("Save failed", result.message || "Could not save product.", "error");
      return;
    }

    await Swal.fire("Saved", product?._id ? "Product updated successfully." : "Product created successfully.", "success");
    router.push("/dashboard/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label"><span className="label-text">Title</span></label>
          <input name="title" defaultValue={product?.title || ""} className="input input-bordered w-full" required />
        </div>
        <div>
          <label className="label"><span className="label-text">Image URL</span></label>
          <input name="image" defaultValue={product?.image || ""} className="input input-bordered w-full" required />
        </div>
        <div>
          <label className="label"><span className="label-text">Category</span></label>
          <input name="category" defaultValue={product?.category || "Educational Toys"} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Age Range</span></label>
          <input name="ageRange" defaultValue={product?.ageRange || "3-6 years"} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Brand</span></label>
          <input name="brand" defaultValue={product?.brand || "HeroKidz"} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Badge</span></label>
          <input name="badge" defaultValue={product?.badge || "Featured"} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Price</span></label>
          <input name="price" type="number" defaultValue={product?.price || 0} className="input input-bordered w-full" required />
        </div>
        <div>
          <label className="label"><span className="label-text">Discount %</span></label>
          <input name="discount" type="number" defaultValue={product?.discount || 0} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Stock</span></label>
          <input name="stock" type="number" defaultValue={product?.stock || 0} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Ratings</span></label>
          <input name="ratings" type="number" step="0.1" defaultValue={product?.ratings || 4.5} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Reviews</span></label>
          <input name="reviews" type="number" defaultValue={product?.reviews || 0} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Sold Count</span></label>
          <input name="sold" type="number" defaultValue={product?.sold || 0} className="input input-bordered w-full" />
        </div>
        <label className="label cursor-pointer justify-start gap-3 mt-8">
          <input name="featured" type="checkbox" className="checkbox checkbox-primary" defaultChecked={product?.featured || false} />
          <span className="label-text">Show on homepage as featured</span>
        </label>
      </div>

      <div>
        <label className="label"><span className="label-text">Gallery Images (one URL per line)</span></label>
        <textarea name="gallery" defaultValue={product?.gallery?.slice(1).join("\n") || ""} className="textarea textarea-bordered w-full" rows={4} />
      </div>

      <div>
        <label className="label"><span className="label-text">Description</span></label>
        <textarea name="description" defaultValue={product?.description || ""} className="textarea textarea-bordered w-full" rows={7} required />
      </div>

      <div>
        <label className="label"><span className="label-text">Key Features (one per line)</span></label>
        <textarea name="info" defaultValue={product?.info?.join("\n") || ""} className="textarea textarea-bordered w-full" rows={5} />
      </div>

      <button disabled={loading} className="btn btn-primary">
        {loading ? "Saving..." : product?._id ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;

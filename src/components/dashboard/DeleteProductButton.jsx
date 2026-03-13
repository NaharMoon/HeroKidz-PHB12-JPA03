"use client";

import Swal from "sweetalert2";
import { deleteProduct } from "@/actions/server/product";
import { useRouter } from "next/navigation";

const DeleteProductButton = ({ productId }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Delete product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirmation.isConfirmed) return;

    const result = await deleteProduct(productId);
    if (!result.success) {
      Swal.fire("Delete failed", result.message || "Something went wrong.", "error");
      return;
    }

    await Swal.fire("Deleted", "Product deleted successfully.", "success");
    router.refresh();
  };

  return <button onClick={handleDelete} className="btn btn-sm btn-outline btn-error">Delete</button>;
};

export default DeleteProductButton;

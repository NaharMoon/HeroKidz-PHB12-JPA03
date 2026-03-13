"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaCartPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { handleCart } from "@/actions/server/cart";

const CartButton = ({ product }) => {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${pathname}`);
      return;
    }

    setIsLoading(true);
    const result = await handleCart(product._id);
    setIsLoading(false);

    if (result.success) {
      router.refresh();
      Swal.fire({
        title: "Added to cart",
        text: `${product.title} has been added to your cart.`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Go to cart",
        cancelButtonText: "Keep shopping",
      }).then((res) => {
        if (res.isConfirmed) router.push("/cart");
      });
      return;
    }

    Swal.fire("Unable to add item", result.message || "Something went wrong.", "error");
  };

  return (
    <button
      disabled={status === "loading" || isLoading || product.stock === 0}
      onClick={handleAddToCart}
      className="btn btn-primary w-full"
    >
      <FaCartPlus />
      {product.stock === 0 ? "Out of stock" : isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default CartButton;

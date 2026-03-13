"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FiHeart } from "react-icons/fi";
import { toggleWishlist } from "@/actions/server/wishlist";

const WishlistButton = ({ product, initialActive = false, fullWidth = false }) => {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onToggle = async () => {
    setLoading(true);
    const result = await toggleWishlist(product);
    setLoading(false);
    if (!result.success) {
      Swal.fire("Wishlist", result.message || "Unable to update wishlist.", "error");
      return;
    }
    setActive(result.active);
    router.refresh();
    Swal.fire("Wishlist", result.message, "success");
  };

  return (
    <button type="button" onClick={onToggle} disabled={loading} className={`btn text-xs text-primary btn-outline ${active ? "btn-secondary" : "btn-ghost"} ${fullWidth ? "w-full" : ""}`}>
      <FiHeart className={active ? "fill-current" : ""} />
      {loading ? "Updating..." : active ? "Wishlisted" : "Add to Wishlist"}
    </button>
  );
};

export default WishlistButton;

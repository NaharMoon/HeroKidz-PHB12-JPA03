"use client";

import Image from "next/image";
import { useState } from "react";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { decreaseItemDb, deleteItemsFromCart, increaseItemDb } from "@/actions/server/cart";
import { formatCurrency } from "@/lib/format";

const CartItem = ({ item, removeItem, updateQuantity }) => {
  const { title, image, quantity, price, _id } = item;
  const [loading, setLoading] = useState(false);

  const handleDeleteCart = async () => {
    const decision = await Swal.fire({
      title: "Remove this item?",
      text: "This product will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
    });

    if (!decision.isConfirmed) return;
    setLoading(true);
    const result = await deleteItemsFromCart(_id);
    setLoading(false);

    if (result.success) {
      removeItem(_id);
      Swal.fire("Removed", "The product has been removed from your cart.", "success");
    } else {
      Swal.fire("Oops", "Something went wrong.", "error");
    }
  };

  const onIncrease = async () => {
    setLoading(true);
    const result = await increaseItemDb(_id, quantity);
    setLoading(false);
    if (result.success) {
      updateQuantity(_id, quantity + 1);
    } else {
      Swal.fire("Notice", result.message || "Could not increase quantity.", "info");
    }
  };

  const onDecrease = async () => {
    setLoading(true);
    const result = await decreaseItemDb(_id, quantity);
    setLoading(false);
    if (result.success) {
      updateQuantity(_id, quantity - 1);
    } else {
      Swal.fire("Notice", result.message || "Could not decrease quantity.", "info");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-base-200">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-base-content/60">Unit Price: {formatCurrency(price)}</p>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-outline" onClick={onDecrease} disabled={quantity === 1 || loading}><FaMinus /></button>
          <span className="min-w-8 text-center font-medium">{quantity}</span>
          <button className="btn btn-sm btn-outline" onClick={onIncrease} disabled={quantity === 10 || loading}><FaPlus /></button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <p className="text-lg font-bold text-primary">{formatCurrency(price * quantity)}</p>
        <button onClick={handleDeleteCart} className="btn btn-sm btn-outline btn-error" disabled={loading}>
          <FaTrash /> Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;

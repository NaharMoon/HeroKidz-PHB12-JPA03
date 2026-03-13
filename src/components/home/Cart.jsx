"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CartItem from "@/components/carrds/CartItem";
import { formatCurrency } from "@/lib/format";

const Cart = ({ cartItem = [] }) => {
  const [items, setItems] = useState(cartItem);

  const removeItem = (id) => setItems((prev) => prev.filter((item) => item._id !== id));
  const updateQuantity = (id, quantity) =>
    setItems((prev) => prev.map((item) => (item._id === id ? { ...item, quantity } : item)));

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shipping = items.length ? 120 : 0;
  const totalPrice = subtotal + shipping;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item._id} item={item} removeItem={removeItem} updateQuantity={updateQuantity} />
        ))}
      </div>

      <div className="h-fit rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm lg:sticky lg:top-24">
        <h3 className="text-xl font-bold">Cart Summary</h3>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><span>Total Items</span><span>{totalItems}</span></div>
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(shipping)}</span></div>
          <div className="flex justify-between border-t border-base-300 pt-3 text-base"><span>Total Price</span><span className="font-bold text-primary">{formatCurrency(totalPrice)}</span></div>
        </div>
        <div className="mt-6 space-y-3">
          <Link href="/checkout" className={`btn btn-primary w-full ${!items.length ? "btn-disabled" : ""}`}>Proceed to Checkout</Link>
          <Link href="/products" className="btn btn-outline w-full">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

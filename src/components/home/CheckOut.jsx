"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { createOrder } from "@/actions/server/Order";
import { formatCurrency } from "@/lib/format";

const CheckOut = ({ cartItems = [] }) => {
  const { status, data } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + Number(item.quantity || 0) * Number(item.price || 0),
        0
      ),
    [cartItems]
  );

  const shipping = cartItems.length ? 120 : 0;
  const totalPrice = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const payload = {
      name: form.name.value,
      email: form.email.value,
      contact: form.contactNo.value,
      address: form.deliveryInfo.value,
      instruction: form.specialInstruction.value,
      paymentMethod: form.paymentMethod.value,
    };

    try {
      if (payload.paymentMethod === "stripe") {
        const stripePayload = {
          fullName: payload.name,
          email: payload.email,
          phone: payload.contact,
          address: payload.address,
          notes: payload.instruction,
          items: cartItems.map((item) => ({
            _id: item._id,
            productId: item.productId || item._id,
            title: item.title,
            price: Number(item.price || 0),
            quantity: Number(item.quantity || 1),
            image: item.image || "",
            category: item.category || "",
          })),
          subtotal,
          shipping,
          total: totalPrice,
        };

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stripePayload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to start Stripe checkout.");
        }

        if (result.url) {
          window.location.href = result.url;
          return;
        }

        throw new Error("Stripe checkout URL was not returned.");
      }

      const result = await createOrder(payload);

      if (result.success) {
        await Swal.fire(
          "Order placed",
          "Your order has been placed successfully.",
          "success"
        );
        router.push(result.redirectTo || "/orders");
        router.refresh();
        return;
      }

      Swal.fire(
        "Unable to place order",
        result.message || "Something went wrong.",
        "error"
      );
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire(
        "Checkout failed",
        error.message || "Something went wrong.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <p>Loading checkout...</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <form
        className="space-y-5 rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-2xl font-bold">Delivery Information</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Please confirm your contact, address, and preferred payment method
            before placing the order.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={data?.user?.name || ""}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              defaultValue={data?.user?.email || ""}
              className="input input-bordered w-full"
              required
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Delivery Address</span>
          </label>
          <textarea
            name="deliveryInfo"
            className="textarea textarea-bordered w-full"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Special Instruction</span>
          </label>
          <textarea
            name="specialInstruction"
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="tel"
              name="contactNo"
              className="input input-bordered w-full"
              placeholder="01XXXXXXXXX"
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Payment Method</span>
            </label>
            <select
              name="paymentMethod"
              className="select select-bordered w-full"
              defaultValue="cod"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="stripe">Stripe Checkout</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-base-200/70 p-4 text-sm text-base-content/70">
          <p className="font-semibold text-base-content">Payment notes</p>
          <p className="mt-1">
            Cash on Delivery places the order instantly. Stripe Checkout
            redirects you to Stripe&apos;s secure payment page before your order
            is confirmed as paid.
          </p>
        </div>

        <button
          disabled={!cartItems.length || loading}
          type="submit"
          className="btn btn-primary w-full"
        >
          {loading ? "Processing..." : "Continue to Place Order"}
        </button>
      </form>

      <div className="h-fit rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-2xl font-bold">Order Summary</h2>

        <div className="mt-5 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between gap-4 border-b border-base-300 pb-3 text-sm last:border-none last:pb-0"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-base-content/60">
                  Qty: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-semibold">
                {formatCurrency(Number(item.quantity || 0) * Number(item.price || 0))}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 border-t border-base-300 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
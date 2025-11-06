"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const total = cart.reduce(
    (sum: number, i: any) => sum + i.price * i.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Your cart is empty");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((i: any) => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
          totalAmount: total,
          address: "N/A",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.whatsappURL) {
        toast.success("Redirecting to WhatsApp...");
        clearCart();
        setTimeout(() => {
          window.open(data.whatsappURL, "_blank");
          window.location.href = `/checkout-success?orderId=${data.orderId}`;
        }, 1500);
      } else toast.error("No WhatsApp link found.");
    } catch (e) {
      toast.error("Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length)
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Link
          href="/products"
          className="bg-[#0A3D79] hover:bg-[#124E9C] text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-8 text-center">
        Your Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {cart.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 bg-white border rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <div className="relative w-full sm:w-32 h-64 sm:h-32 rounded-lg overflow-hidden bg-gray-50">
                <Image
                  fill
                  src={item.image || item.images?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow text-center sm:text-left">
                <h2 className="font-semibold text-[#0A3D79] text-lg">
                  {item.name}
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  ₹{item.price.toFixed(2)} × {item.quantity}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-semibold text-[#0A3D79] mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between text-gray-700 mb-3">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <span>Shipping</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold text-lg text-[#0A3D79] mb-6">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            disabled={loading}
            onClick={handleCheckout}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-[#0A3D79]/70"
                : "bg-[#0A3D79] hover:bg-[#124E9C] hover:shadow-md text-white"
            }`}
          >
            {loading ? "Processing..." : "Proceed to Checkout"}
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 border border-[#0A3D79] text-[#0A3D79] hover:bg-[#0A3D79] hover:text-white font-semibold py-3 rounded-lg transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

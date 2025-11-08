"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const MIN_QTY = 20;

type LineItem = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  size?: number;
};

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [items, setItems] = useState<LineItem[]>(cart as LineItem[]);

  useEffect(() => setItems(cart as LineItem[]), [cart]);

  const changeQty = (id: string, delta: number) => {
    const updated = items.map((it) => {
      const match = it.id === id || it._id === id;
      if (!match) return it;
      const next = Math.max(MIN_QTY, (it.quantity ?? 0) + delta);
      return { ...it, quantity: next };
    });
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * (i.quantity ?? 0), 0),
    [items]
  );

  const confirmOrder = async () => {
    if (!items.length) return toast.error("Cart is empty");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            quantity: Math.max(MIN_QTY, i.quantity ?? 0),
            price: i.price,
            size: i.size,
          })),
          totalAmount: total,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.whatsappURL) throw new Error();
      clearCart();
      window.open(data.whatsappURL, "_blank");
    } catch {
      toast.error("Order failed");
    }
  };

  if (!items.length)
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-600">
        Your cart is empty.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const id = (item.id || item._id) as string;
            return (
              <div key={id} className="rounded-xl border bg-white p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0A3D79]">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#0A3D79]">
                      ₹{(item.price * (item.quantity ?? 0)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(id)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    aria-label="decrease"
                    onClick={() => changeQty(id, -1)}
                    className="h-8 w-8 rounded-md border border-[#0A3D79] text-[#0A3D79]"
                  >
                    –
                  </button>
                  <span className="px-2 text-sm">
                    {Math.max(MIN_QTY, item.quantity ?? 0)}
                  </span>
                  <button
                    aria-label="increase"
                    onClick={() => changeQty(id, +1)}
                    className="h-8 w-8 rounded-md border border-[#0A3D79] text-[#0A3D79]"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0A3D79]">Summary</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-[#0A3D79]">₹{total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <hr className="my-4" />
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-[#0A3D79]">Total</span>
            <span className="font-bold text-[#0A3D79]">₹{total.toFixed(2)}</span>
          </div>
          <button
            onClick={confirmOrder}
            className="mt-6 w-full rounded-lg bg-[#0A3D79] py-3 font-semibold text-white hover:bg-[#124E9C] transition"
          >
            Confirm Order
          </button>
          <p className="mt-3 text-xs text-gray-500">
            Minimum quantity 20 pieces per product is enforced at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}

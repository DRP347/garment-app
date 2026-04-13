"use client";

import { useEffect, useState, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const MIN_QTY = 20;

type LineItem = {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  size?: number;
};

export default function CheckoutPage() {
  const { clearCart, removeFromCart } = useCart();

  const [items, setItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load CART FROM SERVER
  useEffect(() => {
    async function loadServerCart() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = await res.json();
        setItems(data.items || []);
      } catch {
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    }
    loadServerCart();
  }, []);

  const changeQty = (id: string, delta: number) => {
    const updated = items.map((it) => {
      const match = it.id === id || it._id === id;
      if (!match) return it;

      return {
        ...it,
        quantity: Math.max(MIN_QTY, (it.quantity ?? 0) + delta),
      };
    });

    setItems(updated);
  };

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );

  const confirmOrder = async () => {
    if (!items.length) return toast.error("Cart is empty");

    try {
      // Fire INITIATE CHECKOUT event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "InitiateCheckout");
      }

      // Refresh server cart again
      const freshRes = await fetch("/api/cart", { cache: "no-store" });
      const fresh = await freshRes.json();
      const serverItems: LineItem[] = fresh.items || [];

      if (!serverItems.length) return toast.error("Cart is empty");

      const serverTotal = serverItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: serverItems,
          totalAmount: serverTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("ORDER ERROR:", data);
        return toast.error("Order failed");
      }

      // Fire PURCHASE event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Purchase", {
          value: serverTotal,
          currency: "INR",
        });
      }

      // Redirect to WhatsApp
      if (data.whatsappURL) {
        window.open(data.whatsappURL, "_blank");
      }

      clearCart();
      window.location.href = "/order-success";

    } catch (err) {
      console.log("Checkout error:", err);
      toast.error("Order failed");
    }
  };

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-600">
        Loading…
      </div>
    );

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

        {/* LEFT: ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const id = (item.id || item._id) as string;

            return (
              <div
                key={id}
                className="rounded-xl border bg-white p-4 md:p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0A3D79]">{item.name}</h3>
                    <p className="text-gray-500 text-sm">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-[#0A3D79]">
                      ₹{(item.price * item.quantity).toFixed(2)}
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
                    onClick={() => changeQty(id, -1)}
                    className="h-8 w-8 rounded-md border border-[#0A3D79] text-[#0A3D79]">
                    –
                  </button>

                  <span className="px-2 text-sm">{item.quantity}</span>

                  <button
                    onClick={() => changeQty(id, +1)}
                    className="h-8 w-8 rounded-md border border-[#0A3D79] text-[#0A3D79]">
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: SUMMARY */}
        <aside className="h-fit rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0A3D79]">Summary</h2>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold text-[#0A3D79]">
              ₹{total.toFixed(2)}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <hr className="my-4" />

          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold text-[#0A3D79]">Total</span>
            <span className="font-bold text-[#0A3D79]">
              ₹{total.toFixed(2)}
            </span>
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

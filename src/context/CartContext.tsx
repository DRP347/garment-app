"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface CartItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // Load from DB or localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (status !== "authenticated" || !session?.user?.email) return;
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length) {
          setCart(data.items);
          localStorage.setItem("cart", JSON.stringify(data.items));
        } else {
          const local = localStorage.getItem("cart");
          if (local) setCart(JSON.parse(local));
        }
      } catch (err) {
        console.error("load cart error:", err);
      }
    };
    loadCart();
  }, [status, session?.user?.email]);

  // Clear cart on logout
  useEffect(() => {
    if (status === "unauthenticated") {
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [status]);

  const syncDB = async (updated: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    if (status !== "authenticated") return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated }),
        credentials: "include",
      });
    }, 400);
  };

  // Add to cart (min 20 pcs)
  const addToCart = async (item: CartItem) => {
    const updated = [...cart];
    const existing = updated.find((p) => p._id === item._id || p.id === item.id);

    if (existing) {
      existing.quantity += 1;
      toast.success("Quantity updated");
    } else {
      updated.push({ ...item, quantity: 20 });
      toast("Minimum 20 pcs added to cart");
    }

    setCart(updated);
    syncDB(updated);
  };

  const removeFromCart = async (id: string) => {
    const updated = cart.filter((i) => i._id !== id && i.id !== id);
    setCart(updated);
    syncDB(updated);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    syncDB([]);
    toast("Cart cleared");
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

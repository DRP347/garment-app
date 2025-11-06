"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage first
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // When session changes, sync DB cart
  useEffect(() => {
    const syncFromDB = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.items)) {
            setCart(data.items);
            localStorage.setItem("cart", JSON.stringify(data.items));
          }
        }
      } catch (err) {
        console.error("❌ loadCart error:", err);
      }
    };
    syncFromDB();
  }, [session?.user?.email]);

  const syncToDB = async (updatedCart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      if (!session?.user?.email) return;
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedCart }),
          credentials: "include",
        });
      } catch (err) {
        console.error("❌ Error syncing cart:", err);
      }
    }, 600);
  };

  const addToCart = async (item: CartItem) => {
    const updated = [...cart];
    const existing = updated.find((p) => p.id === item.id);
    if (existing) existing.quantity += 1;
    else updated.push({ ...item, quantity: 1 });

    setCart(updated);
    syncToDB(updated);
    toast.success(existing ? "Quantity updated" : "Added to cart");
  };

  const removeFromCart = async (id: string) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    syncToDB(updated);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    syncToDB([]);
    toast("Cart cleared");
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    setCart(updated);
    syncToDB(updated);
    toast.success("Quantity updated");
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

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

  // Load user's cart
  useEffect(() => {
    const loadCart = async () => {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        setCart(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error("❌ Cart load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [session]);

  // Debounced cart sync
  const syncToDB = async (updatedCart: CartItem[]) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      const email = session?.user?.email;
      if (!email) return;

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updatedCart }),
          credentials: "include",
        });
        if (!res.ok) console.warn("Cart sync failed:", await res.text());
      } catch (err) {
        console.error("❌ Error syncing cart:", err);
      }
    }, 700);
  };

  const addToCart = async (item: CartItem) => {
    if (!session?.user?.email) {
      toast.error("Please log in to add items");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      const updated = existing
        ? prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        : [...prev, { ...item, quantity: 1 }];
      queueMicrotask(() =>
        toast.success(existing ? "Quantity updated" : "Added to cart")
      );
      queueMicrotask(() => syncToDB(updated));
      return updated;
    });
  };

  const removeFromCart = async (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    queueMicrotask(() => syncToDB(updated));
    queueMicrotask(() => toast.success("Item removed"));
  };

  const clearCart = async () => {
    setCart([]);
    queueMicrotask(() => syncToDB([]));
    queueMicrotask(() => toast("Cart cleared"));
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updated);
    queueMicrotask(() => syncToDB(updated));
    queueMicrotask(() => toast.success("Quantity updated"));
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

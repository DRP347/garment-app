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
  loading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // ✅ Load cart only when logged in and session is ready
  useEffect(() => {
    const loadCart = async () => {
      if (status !== "authenticated" || !session?.user?.email) return;
      try {
        setLoading(true);
        const res = await fetch("/api/cart", { credentials: "include" });
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length) {
          setCart(data.items);
          localStorage.setItem("cart", JSON.stringify(data.items));
        } else {
          // fallback to localStorage if db empty
          const local = localStorage.getItem("cart");
          if (local) setCart(JSON.parse(local));
        }
      } catch (e) {
        console.error("load cart error:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [status, session?.user?.email]);

  // ✅ Clear cart on logout
  useEffect(() => {
    if (status === "unauthenticated") {
      setCart([]);
      localStorage.removeItem("cart");
    }
  }, [status]);

  // ✅ Sync to DB (with debounce)
  const syncToDB = async (updated: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    if (status !== "authenticated" || !session?.user?.email) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: updated }),
          credentials: "include",
        });
      } catch (err) {
        console.error("sync error:", err);
      }
    }, 500);
  };

  const addToCart = async (item: CartItem) => {
    if (status !== "authenticated") {
      toast.error("Please log in to add items");
      return;
    }
    const id = item._id || item.id;
    const updated = [...cart];
    const existing = updated.find((p) => p._id === id || p.id === id);
    if (existing) existing.quantity += 1;
    else updated.push({ ...item, quantity: 1 });
    setCart(updated);
    syncToDB(updated);
    toast.success(existing ? "Quantity updated" : "Added to cart");
  };

  const removeFromCart = async (id: string) => {
    const updated = cart.filter((i) => i._id !== id && i.id !== id);
    setCart(updated);
    syncToDB(updated);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    syncToDB([]);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((i) =>
      i._id === id || i.id === id ? { ...i, quantity } : i
    );
    setCart(updated);
    syncToDB(updated);
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

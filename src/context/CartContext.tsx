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
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // Load persisted cart on login
  useEffect(() => {
    const load = async () => {
      if (status !== "authenticated" || !session?.user?.email) return;
      try {
        setLoading(true);
        const res = await fetch("/api/cart", { credentials: "include" });
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setCart(data.items);
          localStorage.setItem("cart", JSON.stringify(data.items));
        }
      } catch (e) {
        console.error("❌ load cart error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, session?.user?.email]);

  // Clear on logout
  useEffect(() => {
    if (status === "unauthenticated") {
      localStorage.removeItem("cart");
      setCart([]);
    }
  }, [status]);

  // Flush on unload (fast logout / tab close)
  useEffect(() => {
    const flush = () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
      if (status === "authenticated" && session?.user?.email) {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: cart }),
          credentials: "include",
          keepalive: true,
        }).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", () => {});
    };
  }, [cart, status, session?.user?.email]);

  const scheduleSync = (updated: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updated));
    if (status !== "authenticated" || !session?.user?.email) return;
    // immediate fire
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updated }),
      credentials: "include",
    }).catch(() => {});
    // debounce follow-up
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated }),
        credentials: "include",
      }).catch(() => {});
    }, 500);
  };

  const addToCart = async (item: CartItem) => {
    if (status !== "authenticated") {
      toast.error("Please log in to add items");
      return;
    }
    const updated = [...cart];
    const idx = updated.findIndex((p) => p.id === item.id || (p as any)._id === (item as any)._id);
    if (idx >= 0) updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
    else updated.push({ ...item, quantity: 1 });
    setCart(updated);
    scheduleSync(updated);
    toast.success(idx >= 0 ? "Quantity updated" : "Added to cart");
  };

  const removeFromCart = async (id: string) => {
    const updated = cart.filter((i: any) => i.id !== id && i._id !== id);
    setCart(updated);
    scheduleSync(updated);
    toast.success("Item removed");
  };

  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    scheduleSync([]);
    toast("Cart cleared");
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    const updated = cart.map((i: any) =>
      i.id === id || i._id === id ? { ...i, quantity } : i
    );
    setCart(updated);
    scheduleSync(updated);
    toast.success("Quantity updated");
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

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

  // Load from localStorage if user logged in
  useEffect(() => {
    const loadLocal = () => {
      const saved = localStorage.getItem("cart");
      if (session?.user?.email && saved) {
        setCart(JSON.parse(saved));
      } else if (!session?.user?.email) {
        // if user logged out, clear cart
        localStorage.removeItem("cart");
        setCart([]);
      }
    };
    loadLocal();
  }, [session?.user?.email]);

  const syncToDB = async (updatedCart: CartItem[]) => {
    if (!session?.user?.email) return;
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
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
      syncToDB(updated);
      toast.success(existing ? "Quantity updated" : "Added to cart");
      return updated;
    });
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

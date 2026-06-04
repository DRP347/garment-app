"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

type MetaPixelWindow = Window & {
  fbq?: (command: string, event: string, params?: Record<string, unknown>) => void;
};

interface CartItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image?: string;
  sellerId?: string;
  quantity: number;
  size?: number;
}

interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const syncTimer = useRef<NodeJS.Timeout | null>(null);

  // Load cart from DB or localStorage
  useEffect(() => {
    const loadCart = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        const local = localStorage.getItem("cart");
        if (local) setCart(JSON.parse(local));
        return;
      }

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

  // Sync cart to DB (debounced)
  const syncDB = async (updated: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(updated));

    if (status !== "authenticated") return;

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
        console.error("sync DB error:", err);
      }
    }, 400);
  };

  // Add to cart (MIN 20 PCS) + Pixel Event
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

    // 🔥 META PIXEL — AddToCart event
    const fbq =
      typeof window !== "undefined" ? (window as MetaPixelWindow).fbq : undefined;

    if (fbq) {
      fbq("track", "AddToCart", {
        content_name: item.name,
        value: item.price,
        currency: "INR",
      });
    }

    setCart(updated);
    syncDB(updated);
  };

  // Remove item
  const removeFromCart = async (id: string) => {
    const updated = cart.filter((i) => i._id !== id && i.id !== id);
    setCart(updated);
    syncDB(updated);
    toast.success("Item removed");
  };

  // Clear cart
  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("cart");
    syncDB([]);
    toast("Cart cleared");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
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

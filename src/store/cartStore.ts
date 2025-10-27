import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Product = {
  _id: string;
  name: string;
  price: number;
  sku: string;
};

type CartItem = Product & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id);
          if (existingItem) {
            // // Increase quantity if item already exists
            const updatedItems = state.items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return { items: updatedItems };
          } else {
            // // Add new item
            return { items: [...state.items, { ...product, quantity: 1 }] };
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // // This saves the cart in the browser's local storage
    }
  )
);
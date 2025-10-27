"use client";

import { useCart } from "@/context/CartContext";
import { IProduct } from "@/models/ProductModel";
import { ShoppingCart } from 'lucide-react';

export default function AddToCartButton({ product }: { product: IProduct }) {
  const { addToCart } = useCart();

  return (
    <div className="mt-8">
      <button
        onClick={() => addToCart(product)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-dark transition-colors"
      >
        <ShoppingCart size={20} />
        Add to Cart
      </button>
    </div>
  );
}
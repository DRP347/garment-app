"use client";

import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

export default function CartSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cartItems = [] } = useCart(); // ✅ Safe fallback
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 z-50 border-l border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#0A3D79]">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {cartItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center border-b border-gray-100 pb-2"
                  >
                    <span className="text-sm text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </p>
                <button className="w-full mt-4 bg-[#0A3D79] text-white py-2 rounded-lg font-semibold hover:bg-[#124E9C] transition">
                  Checkout
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

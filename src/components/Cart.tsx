"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";

export function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem } = useCartStore();
  const { data: session } = useSession();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const state = useCartStore.getState();
      if (state.items.length > 0) {
        const payload = {
          user: session?.user,
          items: state.items,
          totalValue: state.items.reduce((total, item) => total + item.price * item.quantity, 0),
        };
        navigator.sendBeacon('/api/cart/abandon', JSON.stringify(payload));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session]);

  const handleFinalizeOrder = () => {
    const clientPhoneNumber = "911234567890"; // // REPLACE with your client's WhatsApp number
    let message = `Hello, The Garment Guy.\nI would like to place an order.\n\n*Partner:* ${session?.user?.name || ''}\n*Business:* ${session?.user?.businessName || ''}\n\n*Order Details:*\n`;
    items.forEach(item => {
      message += `- ${item.name} (SKU: ${item.sku}) - Qty: ${item.quantity}\n`;
    });
    message += `\n*Total Items:* ${totalItems}\n*Estimated Total:* ₹${totalPrice.toFixed(2)}\n\nPlease confirm this order.`;
    const whatsappUrl = `https://wa.me/${clientPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="relative rounded-full p-2 hover:bg-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.838-6.837a1.875 1.875 0 0 0-1.087-2.165l-13.5-3.857a1.875 1.875 0 0 0-2.165 1.087l-1.838 6.837c-.125.492.343.962.835 1.087H5.25Z" /></svg>
        {totalItems > 0 && <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">{totalItems}</span>}
      </button>
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center"><h2 className="text-2xl font-bold font-heading">Your Order</h2><button onClick={() => setIsOpen(false)} className="text-2xl">&times;</button></div>
            <div className="flex-grow mt-6 overflow-y-auto">{items.length > 0 ? items.map(item => (<div key={item._id} className="flex justify-between items-center py-2 border-b"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-500">Qty: {item.quantity}</p></div><div className="text-right"><p>₹{(item.price * item.quantity).toFixed(2)}</p><button onClick={() => removeItem(item._id)} className="text-xs text-red-500 hover:underline">Remove</button></div></div>)) : <p className="text-center text-gray-500">Your cart is empty.</p>}</div>
            <div className="mt-auto border-t pt-4"><div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{totalPrice.toFixed(2)}</span></div><button onClick={handleFinalizeOrder} disabled={items.length === 0} className="mt-4 w-full py-3 font-semibold text-white bg-[var(--brand-gold)] rounded-md disabled:bg-gray-400">Finalize on WhatsApp</button></div>
        </div>
      </div>
    </>
  );
}
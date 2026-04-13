"use client";

import { useState } from "react";

export default function AddToCartClient({
  product,
}: {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description?: string[];
  };
}) {
  const [qty, setQty] = useState(8); // ✅ default MOQ

  const handleBuy = () => {
    const message = `🧾 New Garment Guy Order!

Product: ${product.name}
Quantity: ${qty} pcs
Price: ₹${product.price}

Details:
${product.description?.map((d) => `• ${d}`).join("\n") || ""}

Please confirm availability.`;

    const url = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="mt-6 space-y-4">

      {/* MOQ SELECT */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Select Quantity (MOQ)
        </p>

        <select
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          {[8, 9, 10, 11, 12].map((n) => (
            <option key={n} value={n}>
              {n} pcs
            </option>
          ))}
        </select>
      </div>

      {/* BUY BUTTON */}
      <button
        onClick={handleBuy}
        className="w-full bg-[#0A3D79] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
      >
        Buy Now (WhatsApp)
      </button>
    </div>
  );
}
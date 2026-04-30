"use client";

import { useState } from "react";

type Props = {
  productName: string;
  price: number;
  type: string;
  isSoldOut?: boolean;
};

export default function BuyNowButton({
  productName,
  price,
  type,
  isSoldOut = false,
}: Props) {
  const [moq, setMoq] = useState("8");

  const handleBuy = () => {
    const message = `
🧾 New Garment Guy Order!

Product: ${productName}
Price: ₹${price}

Details:
• Type: ${type}
• Fabric: Premium Cotton
• MOQ: ${moq} pcs
• Fit: Regular Fit
• Dispatch: 5–7 days

Please confirm availability.
    `;

    const url = `https://wa.me/917861988279?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <div className="mt-6">
      {/* MOQ */}
      <label className="text-sm font-medium text-gray-700">
        Select Quantity (MOQ)
      </label>

      <select
        value={moq}
        onChange={(e) => setMoq(e.target.value)}
        disabled={isSoldOut}
        className="mt-2 w-full border rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:text-gray-400"
      >
        {[8, 9, 10, 11, 12, 20, 30, 50].map((q) => (
          <option key={q} value={q}>
            {q} pcs
          </option>
        ))}
      </select>

      {/* BUTTON */}
      <button
        onClick={handleBuy}
        disabled={isSoldOut}
        className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
          isSoldOut
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[#0A3D79] text-white hover:bg-[#08325f]"
        }`}
      >
        {isSoldOut ? "Sold Out" : "Buy Now on WhatsApp"}
      </button>
    </div>
  );
}
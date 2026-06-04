"use client";

import { useState } from "react";
import { makeWhatsAppUrl } from "@/lib/siteConfig";

type Props = {
  productId: string;
  productName: string;
  price: number;
  type: string;
  image?: string;
  sellerId?: string;
  isSoldOut?: boolean;
};

export default function BuyNowButton({
  productId,
  productName,
  price,
  type,
  image,
  sellerId,
  isSoldOut = false,
}: Props) {
  const [moq, setMoq] = useState("8");
  const [loading, setLoading] = useState(false);

  const fallbackWhatsAppUrl = () => {
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

    return makeWhatsAppUrl(message);
  };

  const handleBuy = async () => {
    if (isSoldOut || loading) return;

    const waTab = window.open("about:blank", "_blank");
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId,
              name: productName,
              image,
              price,
              quantity: Number(moq),
              sellerId,
            },
          ],
          totalAmount: price * Number(moq),
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      const whatsappURL =
        res.ok && typeof data.whatsappURL === "string"
          ? data.whatsappURL
          : fallbackWhatsAppUrl();

      if (waTab) waTab.location.href = whatsappURL;
      else window.open(whatsappURL, "_blank");
    } catch {
      const whatsappURL = fallbackWhatsAppUrl();
      if (waTab) waTab.location.href = whatsappURL;
      else window.open(whatsappURL, "_blank");
    } finally {
      setLoading(false);
    }
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
        disabled={isSoldOut || loading}
        className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
          isSoldOut
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[#0A3D79] text-white hover:bg-[#08325f]"
        }`}
      >
        {isSoldOut ? "Sold Out" : loading ? "Opening WhatsApp..." : "Buy Now on WhatsApp"}
      </button>
    </div>
  );
}

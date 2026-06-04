"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { makeWhatsAppUrl } from "@/lib/siteConfig";

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  sellerId?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);

  const images = product.images?.length
    ? product.images
    : ["/image/img1.webp"];

  const name = product.name.toLowerCase();

  const isShortSleeve =
    name.includes("ss") || name.includes("short");

  const isLongSleeve =
    name.includes("ls") || name.includes("long");

  const type = isShortSleeve
    ? "Short Sleeve Shirt"
    : isLongSleeve
    ? "Long Sleeve Shirt"
    : product.category || "Garment";
  const category = (product.category || "").toLowerCase();
  const isSoldOut = category.includes("denim") || category.includes("cargo");

  const message = `
🧾 New Garment Guy Order!

Product: ${product.name}
Price: ₹${product.price || 0}

Details:
• Type: ${type}
• Fabric: Premium Cotton
• MOQ: 8 pcs
• Fit: Regular Fit
• Dispatch: 5–7 days

Please confirm availability.
  `;

  const whatsappUrl = makeWhatsAppUrl(message);

  const handleBuy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const waTab = window.open("about:blank", "_blank");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: product._id,
              name: product.name,
              image: images[0],
              price: product.price || 0,
              quantity: 8,
              sellerId: product.sellerId,
            },
          ],
          totalAmount: (product.price || 0) * 8,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      const targetUrl =
        res.ok && typeof data.whatsappURL === "string"
          ? data.whatsappURL
          : whatsappUrl;

      if (waTab) waTab.location.href = targetUrl;
      else window.open(targetUrl, "_blank");
    } catch {
      if (waTab) waTab.location.href = whatsappUrl;
      else window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <div
      className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* CLICKABLE AREA */}
      <Link href={`/products/${product._id}`} className="block">
        
        {/* IMAGE */}
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image
            src={hovered ? images[1] || images[0] : images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition duration-300 ${
              isSoldOut ? "grayscale" : "group-hover:scale-105"
            }`}
          />

          {/* LEFT OVERLAY DESCRIPTION */}
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end text-white text-xs">
            <p>• {type}</p>
            <p>• Premium Cotton</p>
            <p>• MOQ: 8 pcs</p>
          </div>

          {isSoldOut && (
            <div className="absolute top-3 left-3 rounded-md bg-red-600 px-3 py-1 text-xs font-bold tracking-wide text-white">
              SOLD OUT
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h3 className="font-semibold text-[#0A3D79] truncate">
            {product.name}
          </h3>

          <p className="text-sm font-bold mt-1 text-[#0A3D79]">
            ₹{product.price || 0}
          </p>
        </div>
      </Link>

      {/* BOTTOM ACTION BAR */}
      <div className="absolute bottom-0 left-0 w-full bg-white border-t p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition">
        
        {/* VIEW */}
        <Link
          href={`/products/${product._id}`}
          className="flex-1 text-center border border-[#0A3D79] text-[#0A3D79] py-2 rounded-lg text-sm font-medium hover:bg-[#0A3D79]/10"
        >
          View
        </Link>

        {/* BUY */}
        {isSoldOut ? (
          <span className="flex-1 text-center bg-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
            Sold Out
          </span>
        ) : (
          <button
            type="button"
            onClick={handleBuy}
            className="flex-1 text-center bg-[#0A3D79] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#08325f]"
          >
            Buy
          </button>
        )}
      </div>

      {/* MOBILE FIX: ALWAYS CLICKABLE */}
      <Link
        href={`/products/${product._id}`}
        className="absolute inset-0 z-0 md:hidden"
      />
    </div>
  );
}

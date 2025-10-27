"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images }: { images: string[] }) {
  const validImages = Array.isArray(images) && images.length > 0
    ? images
    : ["/placeholder.png"];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-2 md:max-h-[520px] overflow-auto">
        {validImages.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-16 h-16 rounded-lg border ${
              i === active ? "border-[#0A3D79]" : "border-gray-200"
            } overflow-hidden`}
          >
            <Image
              src={src}
              alt={`thumbnail-${i}`}
              width={64}
              height={64}
              unoptimized
              onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 min-w-0">
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-gray-200">
          <Image
            src={validImages[active]}
            alt="main-product"
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGalleryClient({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div>
      {/* Main Image */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border">
        <Image
          src={images[activeImg]}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={`relative h-16 w-16 rounded-md overflow-hidden border ${
              i === activeImg ? "border-[#0A3D79]" : "border-gray-200"
            }`}
          >
            <Image
              src={src}
              alt={`thumb-${i}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

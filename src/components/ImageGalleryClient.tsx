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
  const [active, setActive] = useState(images[0]);

  return (
    <div>
      {/* MAIN IMAGE */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
        <Image
          src={active}
          alt={name}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 mt-4 overflow-x-auto">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActive(img)}
            className={`relative w-16 h-20 rounded-lg overflow-hidden cursor-pointer border ${
              active === img ? "border-[#0A3D79]" : "border-gray-200"
            }`}
          >
            <Image
              src={img}
              alt="thumb"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
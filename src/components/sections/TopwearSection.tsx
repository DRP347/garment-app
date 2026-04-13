"use client";

export default function TopwearSection() {
  const images = Array.from({ length: 48 }, (_, i) => 
    `/images/topwear/topwear-${String(i + 1).padStart(2, "0")}.webp`
  );

  return (
    <section className="py-20 px-6 md:px-12">
      <h2 className="text-3xl font-semibold mb-10">
        Upperwear Collection
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg aspect-[3/4]"
          >
            <img
              src={src}
              alt="Topwear Product"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
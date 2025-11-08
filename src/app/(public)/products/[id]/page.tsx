"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
  sku?: string;
  category?: string;
};

const SIZES = [28, 30, 32, 34, 36] as const;
const MIN_QTY = 20;

export default function ProductDetailPage() {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<number | null>(null);

  const productId = params?.id ?? null;

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setProduct(data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  const imgs = useMemo(
    () => (product?.images?.length ? product.images : ["/placeholder.png"]),
    [product?.images]
  );

  const addCommon = async (goCheckout: boolean) => {
    if (!product) return;
    if (!size) return toast.error("Select a size first");

    await addToCart({
      id: product._id,
      name: `${product.name} (Size ${size})`,
      price: product.price,
      image: imgs[0],
      quantity: MIN_QTY,
      size,
    });

    if (goCheckout) router.push("/checkout");
    else toast.success("Added to cart");
  };

  if (loading)
    return <div className="max-w-6xl mx-auto px-4 py-16 text-[#0A3D79]">Loading…</div>;

  if (!product)
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-[#0A3D79]">
        Product not found.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border">
            <Image
              src={imgs[activeImg]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative h-16 w-16 rounded-md overflow-hidden border ${
                  i === activeImg ? "border-[#0A3D79]" : "border-gray-200"
                }`}
                aria-label={`Thumbnail ${i + 1}`}
              >
                <Image src={src} alt={`thumb-${i}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A3D79]">
            {product.name}
          </h1>
          <div className="mt-3 text-2xl font-bold text-[#0A3D79]">
            ₹{product.price.toFixed(2)}
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <p className="text-sm text-gray-700 mb-2">Select Size:</p>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    size === s
                      ? "bg-[#0A3D79] text-white border-[#0A3D79]"
                      : "border-gray-300 text-[#0A3D79] hover:bg-[#0A3D79]/10"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => addCommon(false)}
              className="flex-1 bg-[#0A3D79] text-white py-3 rounded-lg font-semibold hover:bg-[#124E9C] transition"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addCommon(true)}
              className="flex-1 border border-[#0A3D79] text-[#0A3D79] py-3 rounded-lg font-semibold hover:bg-[#0A3D79] hover:text-white transition"
            >
              Buy Now
            </button>
          </div>

          {/* Details */}
          <div className="mt-8 space-y-3 text-sm text-gray-700">
            <p>{product.description || "Premium denim crafted for comfort and durability."}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Material: 100% Cotton Denim</li>
              <li>Fit: Relaxed / Straight</li>
              <li>Care: Machine wash cold. Do not bleach.</li>
              <li>Dispatch: 5–7 working days</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

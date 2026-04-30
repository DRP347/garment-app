import ImageGalleryClient from "./ImageGalleryClient";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import BuyNowButton from "./BuyNowButton";
type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
};

export const dynamic = "force-dynamic";

async function getProduct(id: string): Promise<Product | null> {
  try {
    if (!ObjectId.isValid(id)) return null;

    const client = await clientPromise;
    const db = client.db("TheGarmentGuyDB");

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (err) {
    console.error("Product fetch error:", err);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ FIXED (important for Next 15)

  const product = await getProduct(id);
  if (!product) return notFound();

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.png"];

  // ✅ Sleeve Detection
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ✅ IMAGE GALLERY */}
        <ImageGalleryClient images={images} name={product.name} />

        {/* ✅ RIGHT SIDE */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A3D79]">
            {product.name}
          </h1>

          <p className="mt-3 text-2xl font-bold text-[#0A3D79]">
            ₹{product.price || 0}
          </p>

          {isSoldOut && (
            <p className="mt-3 inline-flex rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white">
              Sold Out
            </p>
          )}
          
          
          {/* ✅ DETAILS */}
          <div className="mt-6 text-sm text-gray-700 space-y-2">
            <p><strong>Type:</strong> {type}</p>
            <p><strong>Fabric:</strong> Premium Cotton</p>
            <p><strong>Fit:</strong> Regular Fit</p>
            <p><strong>Dispatch:</strong> 5–7 days</p>
          </div>

          {/* ✅ BUY BUTTON */}
          <BuyNowButton
  productName={product.name}
  price={product.price || 0}
  type={type}
  isSoldOut={isSoldOut}
/>

        </div>
      </div>
    </div>
  );
}
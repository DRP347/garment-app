import ImageGalleryClient from "./ImageGalleryClient";
import AddToCartClient from "./AddToCartClient";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images?: string[];
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
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) return notFound();

  const imgs = product.images?.length ? product.images : ["/placeholder.png"];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Image Gallery */}
        <ImageGalleryClient images={imgs} name={product.name} />

        {/* RIGHT SIDE CONTENT */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A3D79]">
            {product.name}
          </h1>

          <div className="mt-3 text-2xl font-bold text-[#0A3D79]">
            ₹{product.price.toFixed(2)}
          </div>

          {/* ADD TO CART CLIENT UI */}
          <AddToCartClient
            product={{
              _id: product._id,
              name: product.name,
              price: product.price,
              image: imgs[0],
            }}
          />

          {/* DETAILS */}
          <div className="mt-8 space-y-3 text-sm text-gray-700">
            <p>
              {product.description ||
                "Premium denim crafted for comfort and durability."}
            </p>
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

import connectDB from "@/lib/db";
import Product from "@/models/ProductModel";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 30; // Automatic refresh every 30s

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find().lean();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#0A3D79] mb-8 text-center">
        Our Collection
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p: any) => (
          <Link
            key={p._id}
            href={`/products/${p._id}`}
            className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h2 className="font-semibold text-[#0A3D79] text-base truncate">
                {p.name}
              </h2>
              <p className="text-[#0A3D79] font-bold text-sm mt-2">
                ₹{p.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products found.
        </p>
      )}
    </div>
  );
}

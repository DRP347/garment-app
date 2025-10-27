import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import ProductModel from "@/models/ProductModel";
import Image from "next/image";
import { normalizeImagePath } from "@/lib/utils";
import { motion } from "framer-motion";

// --- Fetch the product from the database ---
async function getProduct(productId: string) {
  try {
    await connectDB();
    const product = await ProductModel.findById(productId).lean().exec();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// --- Server Component for Product Details Page ---
export default async function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const session = await getServerSession(authOptions);

  // Redirect unauthorized users
  if (!session) redirect("/login");

  const product = await getProduct(params.productId);

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p>The product you’re looking for does not exist or was removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* --- Product Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* --- Product Image --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200"
        >
          <Image
            src={normalizeImagePath(product.images?.[0])}
            alt={product.name}
            fill
            sizes="100%"
            className="object-cover"
          />
        </motion.div>

        {/* --- Product Info --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-5"
        >
          <h1 className="text-3xl font-bold text-[#0A3D79]">{product.name}</h1>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <p className="text-2xl font-semibold text-[#0A3D79]">
            ₹{(product.price || 0).toLocaleString()}
          </p>

          <div className="flex items-center gap-3 mt-4">
            {product.stock > 0 ? (
              <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                Out of Stock
              </span>
            )}
            <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm">
              Category: {product.category}
            </span>
          </div>

          {/* --- Add to Cart (placeholder for client logic) --- */}
          <button className="mt-6 px-6 py-3 bg-[#0A3D79] text-white font-semibold rounded-lg hover:bg-[#124E9C] transition">
            Add to Cart
          </button>
        </motion.div>
      </div>
    </div>
  );
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import ProductModel from "@/models/ProductModel";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { productId: string };
}) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== "admin") redirect("/dashboard");

  await connectDB();
  const doc = await ProductModel.findById(params.productId).lean().exec();
  if (!doc) {
    return (
      <div className="p-8 text-center text-red-600">
        Product not found.
      </div>
    );
  }

  const product = JSON.parse(JSON.stringify(doc));
  return <EditProductForm product={product} />;
}

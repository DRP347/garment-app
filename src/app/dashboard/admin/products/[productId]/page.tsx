import connectDB from "@/lib/db";
import { requireAdminPage } from "@/lib/authz";
import ProductModel from "@/models/ProductModel";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  await requireAdminPage();

  await connectDB();
  const doc = await ProductModel.findById(productId).lean().exec();
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

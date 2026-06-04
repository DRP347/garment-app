import connectDB from "@/lib/db";
import { requireAdminPage } from "@/lib/authz";
import ProductModel from "@/models/ProductModel";
import AdminProductsTable, {
  type AdminProductRow,
} from "@/components/dashboard/AdminProductsTable";
import {
  DashboardPage,
  DashboardPageHeader,
} from "@/components/dashboard/DashboardPrimitives";

export default async function ProductsPage() {
  await requireAdminPage();

  await connectDB();
  const docs = await ProductModel.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  const products: AdminProductRow[] = JSON.parse(JSON.stringify(docs));

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="Product management"
        description="Manage approved catalogue items and seller submissions without losing the table header while you work."
      />
      <AdminProductsTable products={products} />
    </DashboardPage>
  );
}


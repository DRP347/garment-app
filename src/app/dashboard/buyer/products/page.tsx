import Link from "next/link";
import { PackageSearch } from "lucide-react";
import connectDB from "@/lib/db";
import { requireDashboardRolePage } from "@/lib/authz";
import OrderModel from "@/models/OrderModel";
import BuyerProductsTable, {
  type BuyerProductRow,
} from "@/components/dashboard/BuyerProductsTable";
import {
  DashboardPage,
  DashboardPageHeader,
  EmptyState,
} from "@/components/dashboard/DashboardPrimitives";

type BuyerOrder = {
  _id: string;
  orderId?: string;
  status?: string;
  createdAt?: string;
  items?: {
    productId?: string;
    name?: string;
    image?: string;
    price?: number;
    quantity?: number;
  }[];
};

function productsFromOrders(orders: BuyerOrder[]): BuyerProductRow[] {
  return orders.flatMap((order) =>
    (order.items || []).map((item, index) => ({
      id: `${order._id}-${item.productId || index}`,
      productId: item.productId,
      name: item.name || "Product",
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      status: order.status,
      orderId: order.orderId,
      createdAt: order.createdAt,
    }))
  );
}

export default async function BuyerProductsPage() {
  const session = await requireDashboardRolePage("buyer");

  await connectDB();
  const docs = await OrderModel.find({
    $or: [{ buyerEmail: session.user.email }, { userEmail: session.user.email }],
  })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  const orders: BuyerOrder[] = JSON.parse(JSON.stringify(docs));
  const products = productsFromOrders(orders);

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="My products"
        description="Products appear here only after you inquire about or purchase them."
        actions={
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
          >
            <PackageSearch size={17} />
            Browse products
          </Link>
        }
      />

      {products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products yet"
          description="Products you inquire about or purchase will appear here."
          action={
            <Link
              href="/products"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0A3D79] px-4 text-sm font-semibold text-white transition hover:bg-[#124E9C] active:translate-y-px"
            >
              Browse products
            </Link>
          }
        />
      ) : (
        <BuyerProductsTable products={products} />
      )}
    </DashboardPage>
  );
}


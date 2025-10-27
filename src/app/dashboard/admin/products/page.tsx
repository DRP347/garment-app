import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db";
import ProductModel from "@/models/ProductModel";

type Product = {
  _id: string;
  name: string;
  images?: string[];
  price?: number;
  stock?: number;
  category?: string;
};

function normalizeImagePath(path?: string) {
  const fallback = "/placeholder.png";
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  const cleaned = path.replace(/\\/g, "/").replace(/"/g, "");
  if (cleaned.startsWith("/")) return cleaned;
  const i = cleaned.toLowerCase().indexOf("public/");
  return i !== -1 ? cleaned.substring(i + "public".length) : fallback;
}

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== "admin") redirect("/dashboard");

  await connectDB();
  const docs = await ProductModel.find({})
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  const products: Product[] = JSON.parse(JSON.stringify(docs));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0A3D79]">Manage Products</h1>
        <Link
          href="/dashboard/admin/products/new"
          className="px-4 py-2.5 rounded-lg bg-[#0A3D79] text-white font-medium hover:bg-[#124E9C]"
        >
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Category</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p._id} className="bg-white">
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Image
                        src={normalizeImagePath(p.images?.[0])}
                        alt={p.name}
                        fill
                        sizes="40px"
                        className="rounded object-cover border border-gray-200"
                      />
                    </div>
                    <div className="font-medium">{p.name}</div>
                  </div>
                </Td>
                <Td>₹{Number(p.price || 0).toFixed(2)}</Td>
                <Td>{p.stock ?? 0}</Td>
                <Td className="text-gray-600">{p.category ?? "-"}</Td>
                <Td className="text-right">
                  <Link
                    href={`/dashboard/admin/products/${p._id}`}
                    className="text-[#0A3D79] hover:underline"
                  >
                    Edit
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={
        "px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase " +
        (props.className || "")
      }
    />
  );
}
function Td(props: React.HTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={"px-6 py-4 text-sm " + (props.className || "")} />;
}

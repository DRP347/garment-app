import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type User = {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
};

type Cart = {
  _id: string;
  user: User;
  items: any[];
  total?: number;
  createdAt: string;
};

async function getAbandonedCarts(): Promise<Cart[]> {
  const cookie = cookies().toString();
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/admin/abandoned-carts`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch abandoned carts");
  return res.json();
}

export default async function AbandonedCartsPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== "admin") redirect("/dashboard");

  let carts: Cart[] = [];
  try {
    carts = await getAbandonedCarts();
  } catch (e: any) {
    return (
      <div className="p-8 text-center text-red-600">
        Error: {e?.message ?? "unknown"}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#0A3D79] mb-6">Abandoned Carts</h1>

      {carts.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No abandoned carts.</div>
      ) : (
        <div className="grid gap-4">
          {carts.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-[#0A3D79]">
                    {c.user?.businessName || c.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {c.user?.name} ({c.user?.email})
                  </p>
                  <p className="text-xs text-gray-400">
                    Abandoned on {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    ₹{((c.total ?? 0) as number).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(c.items?.length ?? 0)} item(s)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

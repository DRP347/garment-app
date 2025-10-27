import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import UserModel from "@/models/UserModel";
import { Building, Store } from "lucide-react";

type Partner = {
  _id: string;
  name: string;
  email: string;
  role?: "user" | "admin" | "buyer" | "seller";
  createdAt: string;
};

async function getPartners(): Promise<Partner[]> {
  await connectDB();
  const docs = await UserModel.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean()
    .exec();
  return JSON.parse(JSON.stringify(docs));
}

export default async function ManagePartnersPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== "admin") redirect("/dashboard");

  const partners = await getPartners();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-[#0A3D79] mb-6">Partner Management</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners.length === 0 ? (
              <tr>
                <Td colSpan={4} className="text-center text-gray-500">
                  No partners.
                </Td>
              </tr>
            ) : (
              partners.map((p) => {
                const role = p.role || "user";
                return (
                  <tr key={p._id} className="bg-white">
                    <Td className="font-medium">{p.name}</Td>
                    <Td className="text-gray-600">{p.email}</Td>
                    <Td>
                      <span
                        className={[
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          role === "admin"
                            ? "bg-red-100 text-red-800"
                            : role === "buyer"
                            ? "bg-blue-100 text-blue-800"
                            : role === "seller"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800",
                        ].join(" ")}
                      >
                        {role === "buyer" && <Building size={12} />}
                        {role === "seller" && <Store size={12} />}
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    </Td>
                    <Td className="text-gray-600">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </Td>
                  </tr>
                );
              })
            )}
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
function Td(
  props: React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >
) {
  return <td {...props} className={"px-6 py-4 text-sm " + (props.className || "")} />;
}

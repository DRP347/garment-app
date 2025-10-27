import { getServerSession } from "next-auth"; 
import authOptions from "@/auth.config";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import OrderModel, { IOrder } from "@/models/OrderModel";

// This is a simple, plain object type for our page.
type SimpleOrder = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
};

// This function runs securely on the server.
async function getMyOrders(userId: string): Promise<SimpleOrder[]> {
    await connectDB();
    const rawOrders = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).lean();
    
    // --- THIS IS THE CRITICAL FIX ---
    // This safely converts the complex Mongoose "robot" objects into simple,
    // plain JSON objects that match our 'SimpleOrder' type.
    return JSON.parse(JSON.stringify(rawOrders));
}

export default async function MyOrdersPage() {
    const session = await auth();
    // @ts-ignore
    if (!session || !session.user?.id) {
        redirect('/login');
    }

    // @ts-ignore
    const orders = await getMyOrders(session.user.id);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Order History</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            // The key error is now fixed because order._id is a string.
                            <div key={order._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Order ID: #{order._id.slice(-6)}</p>
                                        {/* The createdAt error is now fixed. */}
                                        <p className="text-xs text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-brand-blue">${(order.total || 0).toFixed(2)}</p>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {order.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
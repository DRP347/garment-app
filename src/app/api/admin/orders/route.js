import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/models/OrderModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// // GET all orders for the admin
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // // Fetch all orders and populate the 'userId' field to get user details
    const orders = await OrderModel.find({})
      .populate('userId', 'name businessName') // // This joins the user's name and businessName
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ADMIN_GET_ORDERS_ERROR:", error);
    return NextResponse.json({ message: 'Server error fetching orders' }, { status: 500 });
  }
}
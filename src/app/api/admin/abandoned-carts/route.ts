import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import OrderModel from '@/models/OrderModel';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    // Fetch all orders and populate user details
    const orders = await OrderModel.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AbandonedCartModel from '@/models/AbandonedCartModel';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const abandonedCarts = await AbandonedCartModel.find({})
      .populate({
        path: 'userId',
        model: 'User', 
        select: 'name email businessName'
      })
      .sort({ lastUpdated: -1 })
      .lean();

    // Ensure data consistency
    const cartsWithUser = abandonedCarts.map(cart => {
        const { userId, ...rest } = cart;
        return { 
            ...rest, 
            user: userId,
            // Ensure total is never null/undefined in the response
            total: rest.total || 0, 
            items: rest.items || []
        };
    });

    return NextResponse.json(cartsWithUser, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching abandoned carts:", error);
    return NextResponse.json({ message: 'Error fetching abandoned carts', error: error.message }, { status: 500 });
  }
}
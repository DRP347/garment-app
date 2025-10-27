import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AbandonedCartModel from '@/models/AbandonedCartModel';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { items, total } = body;
    
    // @ts-ignore
    const userId = session.user.id;

    if (!userId || !items || total == null) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const cart = await AbandonedCartModel.findOneAndUpdate(
      { userId: userId },
      { 
        userId: userId,
        items: items,
        total: total,
        lastUpdated: Date.now(),
      },
      { 
        upsert: true, // Creates a new document if one doesn't exist
        new: true,    // Returns the new, updated document
      }
    );

    return NextResponse.json({ message: 'Abandoned cart saved', cart }, { status: 200 });

  } catch (error: any) {
    console.error("Error in /api/cart/abandon:", error);
    return NextResponse.json({ message: 'Error saving abandoned cart', error: error.message }, { status: 500 });
  }
}

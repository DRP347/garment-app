import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // CORRECT: Uses the working db.ts file
import OrderModel from '@/models/OrderModel';
import { auth } from '@/auth'; // CORRECT: Uses the modern auth function

export async function GET(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Connect to the database
    await connectDB();

    // 3. Fetch orders belonging ONLY to the logged-in user
    // @ts-ignore - The 'id' is custom to our session
    const userId = session.user.id;
    const orders = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  }
}

// You can add your POST function for creating orders here as well,
// following the same secure pattern.
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        
        // Create a new order associated with the logged-in user
        const newOrder = new OrderModel({
            ...body,
            // @ts-ignore
            userId: session.user.id, 
        });

        await newOrder.save();
        return NextResponse.json({ message: "Order created successfully!", order: newOrder }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating order:", error);
        return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
    }
}
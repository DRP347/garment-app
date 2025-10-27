import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/UserModel';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Security Check: Only admins can access this route
    // @ts-ignore
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch all users, but exclude the password field for security
    const partners = await UserModel.find({}).select('-password').sort({ createdAt: -1 }).lean();

    return NextResponse.json(partners, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching partners:", error);
    return NextResponse.json({ message: 'Error fetching partners', error: error.message }, { status: 500 });
  }
}
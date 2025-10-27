import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/UserModel';
import { auth } from '@/auth';

async function isAdmin() {
  const session = await auth();
  // @ts-ignore
  return session?.user?.role === 'admin';
}

// GET all partners/users
export async function GET(req: Request) {
  try {
    if (!await isAdmin()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    await connectDB();
    const partners = await UserModel.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(partners, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching partners', error: error.message }, { status: 500 });
  }
}

// UPDATE a partner's status
export async function PUT(req: Request) {
    try {
        if (!await isAdmin()) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        await connectDB();
        const { partnerId, status } = await req.json(); // Assuming you send status
        const updatedPartner = await UserModel.findByIdAndUpdate(partnerId, { status: status }, { new: true });
        if (!updatedPartner) return NextResponse.json({ message: 'Partner not found' }, { status: 404 });
        return NextResponse.json({ message: 'Partner status updated', partner: updatedPartner }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating partner', error: error.message }, { status: 500 });
    }
}
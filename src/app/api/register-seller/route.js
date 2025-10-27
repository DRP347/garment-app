import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/UserModel';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const { email, password, name, businessName } = data;

    if (!email || !password || !name || !businessName) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'A seller with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the 'seller' role
    await UserModel.create({
      ...data,
      password: hashedPassword,
      role: 'seller', // Set the role to seller
      status: 'approved',
    });

    return NextResponse.json({ message: 'Seller registration successful!' }, { status: 201 });
  } catch (error) {
    console.error('SELLER_REGISTRATION_ERROR:', error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
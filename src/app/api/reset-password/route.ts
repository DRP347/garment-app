import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserModel from '@/models/UserModel';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, password } = await req.json();

    // In a real app, find user by resetPasswordToken and check expiry
    // const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    // if (!user) return NextResponse.json({ message: 'Password reset token is invalid or has expired.' }, { status: 400 });

    // For now, this is a placeholder
    if (!token || !password) return NextResponse.json({ message: 'Missing token or password' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    // user.password = hashedPassword;
    // user.resetPasswordToken = undefined;
    // user.resetPasswordExpires = undefined;
    // await user.save();

    return NextResponse.json({ message: 'Password has been reset (simulation)' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error resetting password', error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { updatePassword, findUserByEmail, comparePassword } from '../../../models/User';

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword, confirmPassword, email } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword || !email) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'New password and confirm password do not match.' },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    await updatePassword(email, newPassword);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, message: 'Error changing password. Please try again.' },
      { status: 500 }
    );
  }
}
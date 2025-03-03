// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { findUserByEmail, findAdminByEmail, updateProfile } from '../../../models/User';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch the user's profile data
    const user = await findUserByEmail(email);

    if (!user) {
      // If the user is not found, check if they are an admin
      const admin = await findAdminByEmail(email);

      if (!admin) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, user: admin, role: 'admin' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, user, role: 'user' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { email, firstName, lastName, username, image, role } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Update the user's profile data
    const updatedUser = await updateProfile(email, {
      first_name: firstName,
      last_name: lastName,
      username,
      image,
    }, role); // Pass the role to the updateProfile function

    return NextResponse.json(
      { success: true, message: 'Profile updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
// src/app/api/adminRegister/route.tsx
import { NextResponse } from 'next/server';
import { createAdmin, findAdminByEmail, findAdminByUsername } from '@/models/Admin';

// POST handler for creating a new admin
export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password } = await request.json();

    // Check if admin with the same email or username already exists
    const existingAdminByEmail = await findAdminByEmail(email);
    const existingAdminByUsername = await findAdminByUsername(username);

    if (existingAdminByEmail) {
      return NextResponse.json(
        { message: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    if (existingAdminByUsername) {
      return NextResponse.json(
        { message: 'Admin with this username already exists' },
        { status: 400 }
      );
    }

    // Create a new admin
    const newAdmin = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
    };

    const createdAdmin = await createAdmin(newAdmin);

    return NextResponse.json(
      { message: 'Admin created successfully', admin: createdAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed
// Example: GET handler for fetching admins
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
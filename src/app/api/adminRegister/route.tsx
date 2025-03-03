import { NextResponse } from 'next/server';
import { createAdmin, findAdminByEmail, findAdminByUsername } from '@/models/Admin';
import { supabase } from '../../../../lib/supabaseClient'; // Import Supabase client

export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password } = await request.json();

    // Check if the request is from an authenticated admin
    const { data: session, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized: Only admins can register new admins.' },
        { status: 401 }
      );
    }

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
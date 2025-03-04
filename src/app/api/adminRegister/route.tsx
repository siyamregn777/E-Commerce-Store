import { NextResponse } from 'next/server';
import { createAdmin, findAdminByEmail, findAdminByUsername } from '@/models/Admin';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password } = await request.json();

    // Get the session token from the request headers
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized: Missing session token.' },
        { status: 401 }
      );
    }

    // Validate the session using the token
    const { data: user, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized: Invalid session.' },
        { status: 401 }
      );
    }

    // Check if the user is an admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.user.id)
      .single();

    if (adminError || !admin) {
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
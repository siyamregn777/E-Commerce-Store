// src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { createUser } from '../../../models/User';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, username, email, password } = await request.json();

    if (!firstName || !lastName || !username || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Create the user in the 'users' table
    const user = await createUser({
      first_name: firstName,
      last_name: lastName,
      username: username,
      email: email,
      password: password,
    });

    // Return the user ID along with the success message
    return NextResponse.json(
      { message: 'Signup successful!', userId: user[0].id }, // Return the user ID
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
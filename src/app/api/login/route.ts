// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserByUsername, comparePassword } from '../../../models/User';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find the user by username
    const user = await findUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: 'user' }, // Include role if needed
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      { success: true, message: 'Login successful', token, role: 'user' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
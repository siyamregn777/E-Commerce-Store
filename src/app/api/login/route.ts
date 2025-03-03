import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserByUsername, comparePassword } from '../../../models/User';
import { findAdminByUsername, compareAdminPassword } from '../../../models/Admin';

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

    const user = await findUserByUsername(username);
    const admin = await findAdminByUsername(username);

    if (!user && !admin) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let isPasswordValid = false;
    let role = '';
    let userId = '';
    let email = '';

    if (user) {
      isPasswordValid = await comparePassword(password, user.password);
      role = 'user';
      userId = user.id;
      email = user.email;
    } else if (admin) {
      isPasswordValid = await compareAdminPassword(password, admin.password);
      role = 'admin';
      userId = admin.id;
      email = admin.email;
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId, username, role, email },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      { success: true, message: 'Login successful', token, role, email },
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
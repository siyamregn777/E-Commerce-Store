import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';  // Use 'supabase' instance



export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('firstName, lastName, username, email, image')
      .eq('email', email)
      .single();

    if (error) throw error;

    return NextResponse.json(user);
  } catch (err) {
    console.error('Error fetching profile data:', err);
    return NextResponse.json(
      { message: 'Failed to fetch profile data', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const { firstName, lastName, username } = await req.json();
    const { error } = await supabase
      .from('users')
      .update({ firstName, lastName, username, updatedAt: new Date() })
      .eq('email', email);

    if (error) throw error;

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Error updating profile:', err);
    return NextResponse.json(
      { message: 'Failed to update profile', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    const cloudData = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok) throw new Error(cloudData.error.message);

    const imageUrl = cloudData.secure_url;

    const { error } = await supabase
      .from('users')
      .update({ image: imageUrl, updatedAt: new Date() })
      .eq('email', email);

    if (error) throw error;

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error('Error uploading image:', err);
    return NextResponse.json(
      { message: 'Failed to upload profile image', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
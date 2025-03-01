import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';  // Use 'supabase' instance



export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    // Step 1: Upload image to Cloudinary
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

    // Step 2: Save the image URL to Supabase
    const { data, error } = await supabase
      .from('images')
      .insert([{ imageUrl, uploadDate: new Date(), source: 'Cloudinary' }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, imageId: data[0].id, imageUrl }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    console.error('An unknown error occurred');
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}

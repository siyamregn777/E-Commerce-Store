import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';  // Use 'supabase' instance


export async function GET() {
  try {
    // Fetch images from the Supabase 'images' table
    const { data, error } = await supabase
      .from('images')  // Ensure this matches the name of your table in Supabase
      .select('*');    // Select all columns from the 'images' table

    if (error) {
      console.error('Error:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Check if data is null or undefined
    if (!data) {
      return NextResponse.json({ success: false, message: 'No images found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, images: data }, { status: 200 });
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    console.error('An unknown error occurred');
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}

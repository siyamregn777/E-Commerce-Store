import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';  // Use 'supabase' instance



export async function DELETE(req: NextRequest) {
  try {
    const imageId = req.nextUrl.searchParams.get('imageId');
    if (!imageId) {
      return NextResponse.json({ success: false, message: 'Image ID is required.' }, { status: 400 });
    }

    // Delete the image from the Supabase table
    const { error } = await supabase
      .from('images') // No type arguments needed
      .delete()
      .eq('id', imageId);

    // Check for any error during deletion
    if (error) {
      console.error('Error:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully.' }, { status: 200 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
    console.error('An unknown error occurred');
    return NextResponse.json({ success: false, message: 'An unexpected error occurred' }, { status: 500 });
  }
}
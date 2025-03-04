import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const price = searchParams.get('price');
  const brand = searchParams.get('brand');

  let query = supabase.from('products').select('*');

  if (category) {
    query = query.ilike('category', `%${category}%`);
  }

  if (price) {
    query = query.lte('price', Number(price));
  }

  if (brand) {
    query = query.ilike('brand', `%${brand}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const brand = formData.get('brand') as string;
    const image = formData.get('image') as File;

    // Upload image to Supabase Storage
    const imageName = `${Date.now()}-${image.name}`;
    const { error: imageError } = await supabase.storage
      .from('product-images')
      .upload(imageName, image);

    if (imageError) {
      console.error('Image Upload Error:', imageError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // Get the public URL of the uploaded image
    const { data: imageUrl } = supabase.storage
      .from('product-images')
      .getPublicUrl(imageName);

    // Insert product into the database
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          category,
          brand,
          image_url: imageUrl.publicUrl, // Save the image URL
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
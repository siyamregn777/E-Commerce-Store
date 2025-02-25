import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

// interface Product {
//   id?: number;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   brand: string;
// }

// GET: Fetch all products (with optional filters)
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

// POST: Add a new product
export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    console.log('New Product Data:', newProduct); // Log the incoming data

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select();

    if (error) {
      console.error('Supabase Error:', error); // Log the Supabase error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Inserted Product:', data); // Log the inserted data
    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    console.error('Server Error:', err); // Log any unexpected errors
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
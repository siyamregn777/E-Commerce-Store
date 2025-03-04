import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabaseClient';

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  try {
    // Await the params to resolve the Promise
    const resolvedParams = await params;

    // Fetch product data from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
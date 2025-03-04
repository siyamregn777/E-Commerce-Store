import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabaseClient';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
import { NextResponse } from 'next/server';
import pool from '@/server/db'; // Adjust the import path as needed

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const price = searchParams.get('price');
    const brand = searchParams.get('brand');

    let query = 'SELECT * FROM products';
    const filters: string[] = [];

    if (category) filters.push(`category = '${category}'`);
    if (price) filters.push(`price <= ${price}`);
    if (brand) filters.push(`brand = '${brand}'`);

    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    const result = await pool.query(query);
    return NextResponse.json(result.rows);
  } catch (err) {
    // Narrow down the type of `err` to `Error`
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json(
        { error: 'Internal Server Error', details: err.message },
        { status: 500 }
      );
    } else {
      console.error('An unknown error occurred:', err);
      return NextResponse.json(
        { error: 'Internal Server Error', details: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
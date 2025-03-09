// types/Product.ts
export interface Product {
  id: string; // UUID
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image_url: string;
  discount?: number;
  created_at?: string; // Optional: Timestamp
}
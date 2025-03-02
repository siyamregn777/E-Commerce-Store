// types/Product.ts
export interface Product {
    id: string; // Use string for UUID
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    image_url: string;
    discount?: number;
  }
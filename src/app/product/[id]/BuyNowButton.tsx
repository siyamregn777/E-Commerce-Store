'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types/Product';

interface BuyNowButtonProps {
  product: Product;
}

export default function BuyNowButton({ product }: BuyNowButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const totalPrice = (product.price * quantity).toFixed(2);
    router.push(`/payment?productId=${product.id}&quantity=${quantity}&totalPrice=${totalPrice}`);
  };

  return (
    <div className="flex flex-col items-start mt-4">
      <div className="flex items-center gap-2 mb-2">
        <label htmlFor="quantity" className="text-lg">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="border rounded-md p-1 w-16 text-center focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <p className="text-xl font-semibold mb-2">Total: ${(product.price * quantity).toFixed(2)}</p>

      <button 
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
        onClick={handleBuyNow}
      >
        Buy Now
      </button>
    </div>
  );
}
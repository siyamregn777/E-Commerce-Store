'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types/Product';
import './product.css';
import { useUser } from '@/context/userContext';

interface BuyNowButtonProps {
  product: Product;
}

export default function BuyNowButton({ product }: BuyNowButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useUser();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.isAuthenticated) {
      router.push('/login');
      return;
    }

    const totalPrice = (product.price * quantity).toFixed(2);
    router.push(`/payment?productId=${product.id}&quantity=${quantity}&totalPrice=${totalPrice}`);
  };

  return (
    <div className="buy-now-container">
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        />
      </div>

      <p className="total-price">Total: ${(product.price * quantity).toFixed(2)}</p>

      <button 
        className="buy-now-btn" 
        onClick={handleBuyNow}
        onMouseDown={(e) => e.preventDefault()} // Prevent focus styles from affecting layout
      >
        Buy Now
      </button>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types/Product';
import './Product.css';
import { useUser } from '@/context/userContext'; // Import the useUser hook

interface BuyNowButtonProps {
  product: Product;
}

export default function BuyNowButton({ product }: BuyNowButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useUser(); // Get the user from the context

  const handleBuyNow = () => {
    // Check if the user is logged in
    if (!user || !user.isAuthenticated) {
      // Redirect to the login page if not logged in
      router.push('/login');
      return;
    }

    // Calculate total price
    const totalPrice = (product.price * quantity).toFixed(2);

    // Redirect to the payment page if logged in
    const paymentUrl = `/payment?productId=${product.id}&quantity=${quantity}&totalPrice=${totalPrice}`;
    router.push(paymentUrl);
  };

  return (
    <>
      <div className="quantity-selector">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity}
          min="1"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <p className="total-price">Total: ${(product.price * quantity).toFixed(2)}</p>

      <button className="buy-now-btn" onClick={handleBuyNow}>
        Buy Now
      </button>
    </>
  );
}
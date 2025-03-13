'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProductById } from '../../models/Product';
import { Product } from '../../types/Product';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import './payment.css';

// Wrap the main component in Suspense
export default function PaymentPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PaymentPageContent />
    </Suspense>
  );
}

// Move the main logic to a separate component
function PaymentPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity');
  const totalPrice = searchParams.get('totalPrice');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'paypal' | 'bank' | null>(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleBankPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) {
      alert('Please enter a valid transaction ID.');
      return;
    }
    alert(`Transaction ID submitted: ${transactionId}`);
    console.log('Transaction ID:', transactionId);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="payment-container">
      <h1>Checkout</h1>
      <div className="product-details">
        <h2>{product.name}</h2>
        <p>Quantity: {quantity}</p>
        <p>Total Price: ${totalPrice}</p>
      </div>

      <div className="payment-options">
        <div
          className={`option ${selectedOption === 'paypal' ? 'selected' : ''}`}
          onClick={() => setSelectedOption('paypal')}
        >
          <h2>Pay with PayPal</h2>
          <p>Secure and fast payment through PayPal.</p>
          {selectedOption === 'paypal' && (
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                currency: 'USD',
              }}
            >
              <PayPalButtonsWrapper totalPrice={totalPrice} product={product} />
            </PayPalScriptProvider>
          )}
        </div>

        <div
          className={`option ${selectedOption === 'bank' ? 'selected' : ''}`}
          onClick={() => setSelectedOption('bank')}
        >
          <h2>Pay via Bank Transfer</h2>
          <p>Make a direct transfer to our bank account.</p>
          {selectedOption === 'bank' && (
            <div className="bank-details">
              <h3>Bank Details</h3>
              <p>Account Number: 123456789</p>
              <p>Please include your order ID as the reference.</p>

              <form className="bank-transfer-form" onSubmit={handleBankPaymentSubmit}>
                <label htmlFor="transactionId">Transaction ID:</label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter your transaction ID"
                  required
                />
                <button type="submit">Submit Transaction ID</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// PayPalButtonsWrapper component to handle loading state
function PayPalButtonsWrapper({ totalPrice, product }: { totalPrice: string | null; product: Product }) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <LoadingSpinner />; // Show a spinner while the SDK is loading
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical' }}
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                value: totalPrice || '0.00',
                currency_code: 'USD',
              },
              description: `Payment for ${product.name}`,
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        if (!actions.order) {
          return Promise.reject('Order not found');
        }
        return actions.order.capture().then((details) => {
          alert(`Payment completed by ${details.payer?.name?.given_name || 'a user'}`);
          console.log('Payment details:', details);
        });
      }}
      onError={(error) => {
        console.error('PayPal error:', error);
        alert('An error occurred during payment. Please try again.');
      }}
    />
  );
}
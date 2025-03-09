'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/models/Product';
import { Product } from '@/types/Product';
import LoadingSpinner from '@/components/LoadingSpinner';
import '@/styles/home.css';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch products with a limit of 5
        const data = await fetchProducts({ limit: 12 });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className='home-container'>
      {/* Hero Section */}
      <div className='hero-section'>
        <div className='image-container'>
          <Image
            src="/home.webp"
            alt="Welcome to E-Commerce Store"
            width={1500}
            height={900}
            className='hero-image'
          />
        </div>
        <div className='hero-text'>
          <h1>Welcome to the E-Commerce Store</h1>
          <p>Explore our products, learn more about us, or get in touch!</p>
          <button className='cta-button'>Shop Now</button>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className='featured-products'>
        <h2>Featured Products</h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className='error-message'>{error}</p>
        ) : (
          <div className='product-grid'>
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className='product-card'>
                  <div className='product-image-container'>
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={300}
                        height={300}
                        className='product-image'
                      />
                    ) : (
                      <Image
                        src="/images/placeholder.jpg"
                        alt="Placeholder"
                        width={300}
                        height={300}
                        className='product-image'
                      />
                    )}
                  </div>
                  <h3 className='product-name'>{product.name}</h3>
                  <p className='product-price'>Price: ${product.price}</p>
                  <button className='add-to-cart'>Add to Cart</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
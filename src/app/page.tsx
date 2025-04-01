'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/models/Product';
import { Product } from '@/types/Product';
import LoadingSpinner from '@/components/LoadingSpinner';
import '@/styles/home.css';

// Array of hero images for the slideshow
const heroImages = [
  { src: '/arturo-rey-5yP83RhaFGA-unsplash.jpg', alt: 'Welcome to E-Commerce Store' },
  { src: '/blake-wisz-Xn5FbEM9564-unsplash.jpg', alt: 'Summer Collection' },
  { src: '/freestocks-_3Q3tsJ01nc-unsplash.jpg', alt: 'New Arrivals' },
  { src: '/heidi-fin-2TLREZi7BUg-unsplash.jpg', alt: 'Special Offers' },
  { src: '/marvin-meyer-SYTO3xs06fU-unsplash.jpg', alt: 'Premium Selection' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides with smooth transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
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
      {/* Hero Section with Slideshow */}
      <div className='hero-section'>
        <div className='slideshow-container'>
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className='image-container'>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1500}
                  height={900}
                  className='hero-image'
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='hero-text'>
          <h1>Welcome to the E-Commerce Store</h1>
          <p>Explore our products, learn more about us, or get in touch!</p>
          <Link href="/ecommerce"><button className='cta-button'>Shop Now</button></Link>
          
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
                        width={280}
                        height={280}
                        className='product-image'
                      />
                    ) : (
                      <Image
                        src="/images/placeholder.jpg"
                        alt="Placeholder"
                        width={280}
                        height={280}
                        className='product-image'
                      />
                    )}
                  </div>
                  <div className='product-info'>
                    <h3 className='product-name'>{product.name}</h3>
                    <p className='product-price'>${product.price.toFixed(2)}</p>
                    <button className='add-to-cart'>Add to Cart</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/models/Product';
import { Product } from '@/types/Product';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    <div className="font-sans text-gray-800 max-w-full overflow-x-hidden animate-fadeIn">
      {/* Hero Section with Slideshow */}
      <div className="relative text-center text-white h-[80vh] max-h-[800px] overflow-hidden">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0'
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1500}
                  height={900}
                  className="w-full h-full object-cover"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[90%] max-w-[1200px] text-shadow">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">Welcome to the E-Commerce Store</h1>
          <p className="text-xl md:text-2xl mb-8 leading-normal">Explore our products, learn more about us, or get in touch!</p>
          <Link href="/ecommerce">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-md text-xl font-semibold cursor-pointer transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:ring-opacity-40">
              Shop Now
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 px-8 text-center bg-gray-50">
        <h2 className="text-3xl md:text-4xl mb-8 text-gray-800">Featured Products</h2>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 px-4 max-w-[1000px] mx-auto">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="bg-white rounded-md overflow-hidden shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
                  <div className="relative w-full pt-[90%] overflow-hidden">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={280}
                        height={280}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <Image
                        src="/images/placeholder.jpg"
                        alt="Placeholder"
                        width={280}
                        height={280}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                    <p className="text-gray-600 mb-3">${product.price.toFixed(2)}</p>
                    <button className="w-3/5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300">
                      Add to Cart
                    </button>
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
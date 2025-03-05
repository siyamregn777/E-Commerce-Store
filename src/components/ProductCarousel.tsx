// src/components/ProductCarousel.tsx
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { Product } from '../types/Product'; // Use the imported Product type

const ProductCarousel = ({ products }: { products: Product[] }) => {
  // Adjust slidesToShow based on the number of products
  const slidesToShow = Math.min(3, products.length); // Show up to 3 slides, but no more than the number of products

  const settings = {
    dots: true,
    infinite: false, // Disable infinite looping to avoid duplicate slides
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Adjust for smaller screens
        settings: {
          slidesToShow: Math.min(2, products.length), // Show up to 2 slides on medium screens
        },
      },
      {
        breakpoint: 600, // Adjust for mobile screens
        settings: {
          slidesToShow: 1, // Always show 1 slide on small screens
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {products.map((product) => (
        <div key={product.id} className="carousel-item">
          <Image
            src={product.image_url || '/images/placeholder.jpg'} // Fallback image
            alt={product.name}
            width={300}
            height={200}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; // Fallback if image fails to load
            }}
          />
          <h3>{product.name}</h3>
        </div>
      ))}
    </Slider>
  );
};

export default ProductCarousel;
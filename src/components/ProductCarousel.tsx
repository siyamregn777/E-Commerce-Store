import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { Product } from '../types/Product';
import '../styles/carousel.css';

const ProductCarousel = ({ products }: { products: Product[] }) => {
  const slidesToShow = Math.min(3, products.length); // Show up to 3 slides

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    centerMode: true, // Enable center mode
    centerPadding: '0', // No padding for the center slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, products.length),
          centerMode: true,
          centerPadding: '0',
        },
      },
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: '0',
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '0',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '0',
        },
      },
    ],
    prevArrow: <div className="slick-arrow slick-prev">←</div>,  // Left arrow (<-)
    nextArrow: <div className="slick-arrow slick-next">→</div>,  // Right arrow (->)
    dots: false,  // Disable dots
  };

  return (
    <Slider {...settings}>
      {products.map((product) => (
        <div key={product.id} className="carousel-item">
          <Image
            src={product.image_url || '/images/placeholder.jpg'}
            alt={product.name}
            width={300}
            height={200}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
            }}
            className="carousel-image"
          />
          <h3>{product.name}</h3>
        </div>
      ))}
    </Slider>
  );
};

export default ProductCarousel;

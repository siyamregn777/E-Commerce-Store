import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { Product } from '../types/Product';
import '../styles/carousel.css';

// Define the type for the arrow props
interface ArrowProps {
  onClick?: () => void;
}

const ProductCarousel = ({ products }: { products: Product[] }) => {
  const slidesToShow = Math.min(3, products.length); // Show up to 3 slides

  // Custom Arrow Components with proper typing
  const PrevArrow = ({ onClick }: ArrowProps) => {
    return (
      <div className="slick-arrow slick-prev" onClick={onClick}>
        ←
      </div>
    );
  };

  const NextArrow = ({ onClick }: ArrowProps) => {
    return (
      <div className="slick-arrow slick-next" onClick={onClick}>
        →
      </div>
    );
  };

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
    prevArrow: <PrevArrow />, // Use custom PrevArrow component
    nextArrow: <NextArrow />, // Use custom NextArrow component
    dots: false,
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
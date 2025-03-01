// src/app/ecommerce/ProductCarousel.tsx
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';

// src/app/ecommerce/ProductCarousel.tsx
type Product = {
    id: number;  
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    image_url: string; // Assuming price is a number, change as needed
  };
  

const ProductCarousel = ({ products }: { products: Product[] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {products.map((product) => (
        <div key={product.id} className="carousel-item">
          <Image src={product.image_url} alt={product.name} width={300} height={200} />
          <h3>{product.name}</h3>
        </div>
      ))}
    </Slider>
  );
};

export default ProductCarousel;

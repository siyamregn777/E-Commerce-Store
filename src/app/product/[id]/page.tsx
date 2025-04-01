import { use } from 'react';
import { fetchProductById } from '../../../models/Product';
import BuyNowButton from './BuyNowButton';
import './product.css'
import ProductImage from './ProductImage'; // Import the new Client Component

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  // Unwrap params using React.use()
  const { id } = use(Promise.resolve(params)) as { id: string };

  // Fetch product data
  const product = use(fetchProductById(id));

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div  className="product-details-container pt-16">
      <h1 className="product-name">{product.name}</h1>
      <ProductImage
        src={product.image_url}
        alt={product.name}
        width={400}
        height={400}
        className="product-image"
      />
      <p className="product-description">{product.description}</p>
      <p className="product-price">Price: ${product.price}</p>
      <p className="product-brand">Brand: {product.brand}</p>

      {/* Client-side interactive component */}
      <BuyNowButton product={product} />
    </div>
  );
}
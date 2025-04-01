import { use } from 'react';
import { fetchProductById } from '../../../models/Product';
import BuyNowButton from './BuyNowButton';
import ProductImage from './ProductImage';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(Promise.resolve(params)) as { id: string };
  const product = use(fetchProductById(id));

  if (!product) {
    return <p className="text-center text-red-500">Product not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 pt-16 bg-gray-50 rounded-lg shadow-lg text-black">
      <h1 className="text-3xl font-bold text-center mb-4">{product.name}</h1>
      <ProductImage
        src={product.image_url}
        alt={product.name}
        width={400}
        height={400}
        className="rounded-lg shadow-md mb-4 hover:scale-103 transition-transform duration-300"
      />
      <p className="text-lg mb-2 text-center max-w-3xl mx-auto">{product.description}</p>
      <p className="text-xl font-semibold">Price: ${product.price}</p>
      <p className="text-lg">Brand: {product.brand}</p>
      <BuyNowButton product={product} />
    </div>
  );
}
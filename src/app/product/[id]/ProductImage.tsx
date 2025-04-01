'use client';

import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function ProductImage({ src, alt, width, height, className }: ProductImageProps) {
  return (
    <div className="image-container">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`product-image ${className}`}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
        }}
      />
    </div>
  );
}
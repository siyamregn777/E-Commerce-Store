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
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        // Fallback image if the image fails to load
        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
      }}
    />
  );
}
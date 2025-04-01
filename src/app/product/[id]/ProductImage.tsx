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
    <div className="w-full max-w-[400px] mx-auto mb-8 overflow-hidden rounded-xl shadow-lg">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-auto object-contain max-h-[400px] ${className}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
        }}
      />
    </div>
  );
}
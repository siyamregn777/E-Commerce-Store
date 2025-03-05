// next.config.js
module.exports = {
  images: {
    domains: ['hvlqavpucfnuiacdnfkf.supabase.co'], // Allow images from Supabase storage
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hvlqavpucfnuiacdnfkf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
    // Increase timeout for image loading
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    proxyClientMaxBodySize: '20mb'
  },
  
  poweredByHeader: false,
  compress: true,
  trailingSlash: false,
    images: {
  unoptimized: false,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'img.youtube.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'http',  // for local dev
      hostname: 'localhost',
      port: '3000',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https', // for production
      hostname: 'webdemosbe.xyz',
      port: '',
      pathname: '/uploads/**',
    },
    {
      protocol: 'https', // for production
      hostname: 'sbacoustics.com',
      port: '',
      pathname: '/uploads/**',
    },
    ],
    dangerouslyAllowLocalIP: true,
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS, PUT, PATCH, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' https://www.google.com/ https://www.youtube.com/;
              img-src 'self' data: blob: https://img.youtube.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.co.id https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png https://c.tile.openstreetmap.org https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://webdemosbe.xyz https://*.basemaps.cartocdn.com;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google.com https://www.gstatic.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' data: https://fonts.gstatic.com;
              connect-src 'self' blob: https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://ipapi.co https://www.google.com https://www.gstatic.com https://webdemosbe.xyz;
            `.replace(/\n/g, ' ')
          }
        ],
      },
    ];
  },
};

export default nextConfig;
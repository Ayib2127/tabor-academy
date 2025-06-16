const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable ESLint during builds in production
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Optimize images for production
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'fmbakckfxuabratissxg.supabase.co' // Add your Supabase storage domain
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'], // Add AVIF format for better compression
  },

  // Remove experimental features for production stability
  experimental: {
    // Only enable in development
    optimizeCss: process.env.NODE_ENV === 'development',
    optimizePackageImports: process.env.NODE_ENV === 'development' ? ['lucide-react'] : [],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('isomorphic-dompurify');
    }
    
    // Add performance optimizations
    config.optimization = {
      ...config.optimization,
      minimize: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // Ignore OpenTelemetry and Sentry warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@opentelemetry/ },
      { module: /node_modules\/@sentry/ }
    ];
    
    // Fix Supabase realtime-js dependency issue
    config.resolve.alias = {
      ...config.resolve.alias,
      '@rails/actioncable': path.resolve(
        __dirname,
        'node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js'
      ),
    };

    // Fix big strings warning
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    };

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://www.googletagmanager.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://www.google-analytics.com",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co https://fmbakckfxuabratissxg.supabase.co https://www.google-analytics.com https://api.taboracademy.com",
              "media-src 'self' https://*.supabase.co",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ];
  },

  // Add production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  
  // Add environment variable validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
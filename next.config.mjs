import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'fmbakckfxuabratissxg.supabase.co'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: process.env.NODE_ENV === 'development',
    optimizePackageImports: process.env.NODE_ENV === 'development' ? ['lucide-react'] : []
  },
  webpack: (config, { isServer }) => {
    // Use require for webpack only inside this function
    const webpack = require('webpack');

    if (isServer) {
      config.externals.push('isomorphic-dompurify');
    }
    
    // Use __dirname directly
    const selfPolyfillPath = path.resolve(__dirname, 'lib/utils/self-polyfill.js');
    
    // Performance optimizations
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
          // Supabase-specific optimization
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 0,
          },
        },
      },
    };

    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\\@opentelemetry/ },
      { module: /node_modules\\@sentry/ },
      { module: /node_modules\\@supabase\\realtime-js/ }
    ];
    
    // Fix Supabase realtime-js dependency issue
    config.resolve.alias = {
      ...config.resolve.alias,
      '@rails/actioncable': path.resolve(__dirname, 'node_modules/@rails/actioncable/app/assets/javascripts/action_cable.js'),
      // Polyfill alias
      'globalthis-polyfill': selfPolyfillPath,
      '@': __dirname,
    };

    // Fix big strings warning
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year cache
      compression: 'gzip',
      cacheDirectory: path.resolve(__dirname, '.next/cache'),
    };

    // Polyfill Buffer for both client and server
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        buffer: ['buffer', 'Buffer'],
      })
    );

    // Polyfill process and buffer for client-side
    if (!isServer) {
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: 'buffer',
        process: 'process/browser',
      };
    }

    config.module.rules.push({
      test: /\.(yaml|yml)$/,
      use: ['yaml-loader']
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://browser.sentry-cdn.com",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://images.unsplash.com https://*.supabase.co https://www.google-analytics.com https://res.cloudinary.com https://cdn.jsdelivr.net https://lh3.googleusercontent.com https://*.cloudinary.com https://*.imgix.net https://*.amazonaws.com https://*.vercel.app https://*.githubusercontent.com",
              "media-src 'self' blob: data: https://images.unsplash.com https://*.supabase.co https://www.google-analytics.com https://res.cloudinary.com https://cdn.jsdelivr.net https://lh3.googleusercontent.com https://*.cloudinary.com https://*.imgix.net https://*.amazonaws.com https://*.vercel.app https://*.githubusercontent.com",
              "font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "connect-src 'self' wss://*.supabase.co https://*.supabase.co https://fmbakckfxuabratissxg.supabase.co https://www.google-analytics.com https://*.ingest.sentry.io https://*.sentry.io",
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
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

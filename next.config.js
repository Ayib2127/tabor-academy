    /** @type {import('next').NextConfig} */
    const nextConfig = {
      eslint: {
        ignoreDuringBuilds: true,
      },
      images: {
        unoptimized: true,
        domains: [
          'images.unsplash.com',
          'res.cloudinary.com'
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp']
      },
      experimental: {
        optimizeCss: true,
        optimizePackageImports: ['lucide-react'],
      },
      webpack: (config, { isServer }) => {
        if (isServer) {
          config.externals.push('isomorphic-dompurify');
        }
        return config;
      },
      async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://*.supabase.co https://www.google-analytics.com; font-src 'self'; connect-src 'self' https://*.supabase.co https://fmbakckfxuabratissxg.supabase.co https://www.google-analytics.com https://api.taboracademy.com; media-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
              },
            ],
          },
        ];
      },
    };

    module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sentry/node'],
  },
  webpack: (config, { isServer }) => {
    // Suppress OpenTelemetry warnings
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
    ];
    
    return config;
  },
  // Add this to handle dynamic imports
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 
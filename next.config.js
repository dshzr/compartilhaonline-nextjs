const webpack = require("webpack");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        oracledb: false, // Define fallback para o módulo oracledb
      };
    }
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^oracledb$/,
      })
    );
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  generateEtags: true,
  compress: true,
  onError: async (err) => {
    console.error('Next.js Runtime Error:', err);
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  }
};

module.exports = nextConfig;

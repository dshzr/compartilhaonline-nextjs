/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Ignora os dialetos do Knex que não estamos usando
    config.resolve.alias = {
      ...config.resolve.alias,
      'mssql': false,
      'mysql': false,
      'mysql2': false,
      'oracledb': false,
      'sqlite3': false,
      'tedious': false
    }

    // Adiciona módulos externos
    config.externals = [
      ...(config.externals || []),
      'pg-query-stream',
      'pg-native'
    ];

    return config;
  }
};

export default nextConfig;

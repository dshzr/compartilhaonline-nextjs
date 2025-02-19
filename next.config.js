const webpack = require("webpack");

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
  // Desabilitar geração estática para rotas dinâmicas
  experimental: {
    // Força todas as rotas a serem server-side rendered
    workerThreads: false,
    cpus: 1
  },
};

module.exports = nextConfig;

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactCompiler: true,
  reactStrictMode: true,

  turbopack: {
    rules: {
      '*.svg': {
        as: '*.js',
        loaders: ['@svgr/webpack'],
      },
    },
  },
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,

  webpack: (config) => {
    // Configures webpack to handle SVG files with SVGR.
    // SVGR optimizes and transforms SVG files into React components.
    // See https://react-svgr.com/docs/next/

    // Grab the existing rule that handles SVG imports.
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        resourceQuery: /url/, // *.svg?url
        test: /\.svg$/i,
      },

      // Convert all other *.svg imports to React components.
      {
        issuer: fileLoaderRule.issuer,
        // Exclude if *.svg?url
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        test: /\.svg$/i,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              titleProp: true,
            },
          },
        ],
      },
    )

    // Modify the file loader rule to ignore *.svg,
    // since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
}

export default nextConfig

module.exports = {
  poweredByHeader: false,
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      loader: '@svgr/webpack',
    })

    return config
  },
}

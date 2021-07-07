module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
          components: './src/components',
          pages: './src/pages',
          images: './src/images',
          public: './public',
          styles: './src/styles',
          utils: './src/utils',
        },
      },
    ],
  ],
}

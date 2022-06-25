module.exports = {
  plugins: {
    'postcss-pxtorem': {
      minPixelValue: 2,
      propList: ['*'],
    },
    'postcss-custom-properties': {
      importFrom: './src/styles/globals.css',
      preserve: false,
    },
    'postcss-normalize': {
      forceImport: false,
    },
    'postcss-flexbugs-fixes': {},
    'postcss-nesting': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
      },
    },
  },
}

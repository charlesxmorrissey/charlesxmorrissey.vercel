/** @type {import("svgo").Config} */

export default {
  plugins: [
    {
      name: 'removeViewBox',
      params: {
        removeViewBox: false,
      },
    },
    {
      name: 'removeDimensions',
      params: {
        removeDimensions: true,
      },
    },
  ],
}

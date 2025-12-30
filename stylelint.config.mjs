/** @type {import('stylelint').Config} */

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],

  ignoreFiles: [
    '**/coverage/**',
    '**/dist/**',
    '**/node_modules/**',
    '**/out/**',
  ],

  plugins: ['stylelint-order'],

  rules: {
    'at-rule-no-unknown': null,
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': '^[a-z][a-zA-Z0-9]',
  },
}

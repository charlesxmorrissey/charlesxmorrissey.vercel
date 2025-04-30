/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

export default {
  importOrder: [
    '^react$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>',
    '',
    '^[.]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '5.7.2',
  jsxSingleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  proseWrap: 'always',
  semi: false,
  singleQuote: true,
}

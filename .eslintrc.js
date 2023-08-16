module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },

  extends: [
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:typescript-sort-keys/recommended',
    'prettier',
  ],

  parser: '@typescript-eslint/parser',

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
    'eslint-plugin-import-helpers',
    'prefer-arrow',
    'prettier',
    'react-hooks',
    'react',
    'sort-destructure-keys',
    'sort-export-all',
    'typescript-sort-keys',
    'unused-imports',
  ],

  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: '*', next: ['interface', 'type'] },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: ['case', 'default'], next: '*' },
      { blankLine: 'always', prev: 'iife', next: '*' },
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'import-helpers/order-imports': [
      'error',
      {
        alphabetize: { order: 'asc', ignoreCase: false },
        groups: [
          'module',
          '/^(assets|components|constant|hooks|mocks|pages|reducers|styles|types|utils)/',
          '/^styles/',
          '/^public/',
          ['sibling', 'index'],
        ],
        newlinesBetween: 'always',
      },
    ],
    'import/no-unresolved': 'off',
    'newline-after-var': [2, 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'prefer-arrow/prefer-arrow-functions': 'warn',
    'prefer-const': 'error',
    'prefer-destructuring': ['error', { array: false, object: true }],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', 'jsx'] }],
    'react/jsx-sort-props': 'error',
    'react/no-children-prop': 'error',
    'react/no-unknown-property': [
      'error',
      { ignore: ['global', 'jsx', 'object'] },
    ],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-export-all/sort-export-all': [
      'error',
      'asc',
      {
        caseSensitive: false,
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-keys': ['error'],
    'unused-imports/no-unused-imports': 'error',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}

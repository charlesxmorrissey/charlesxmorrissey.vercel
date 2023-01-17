module.exports = {
  env: {
    browser: true,
    es2020: true,
    jest: true,
    node: true,
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'react',
    'react-hooks',
    'prettier',
    'eslint-plugin-import-helpers',
    'sort-destructure-keys',
    'typescript-sort-keys',
  ],

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'plugin:@next/next/recommended',
    'plugin:typescript-sort-keys/recommended',
  ],

  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 2,
    'import-helpers/order-imports': [
      'warn',
      {
        alphabetize: { order: 'asc', ignoreCase: false },
        groups: [
          'module',
          '/^(constant|helpers|hooks|utils)/',
          '/^pages/',
          '/^components/',
          '/^images/',
          '/^styles/',
          '/^public/',
          ['parent', 'sibling', 'index'],
        ],
        newlinesBetween: 'always',
      },
    ],
    'import/no-unresolved': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'prefer-const': [
      2,
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react/display-name': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', 'jsx'] }],
    'react/jsx-sort-props': 'error',
    'react/no-children-prop': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'sort-keys': ['error'],
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}

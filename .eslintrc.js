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
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'react',
    'react-hooks',
    'prettier',
    'eslint-plugin-import-helpers',
  ],

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jsdoc/recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'prettier',
    'plugin:@next/next/recommended',
  ],

  rules: {
    'import/no-unresolved': 'off',
    'import-helpers/order-imports': [
      'warn',
      {
        alphabetize: { order: 'asc', ignoreCase: false },
        groups: [
          'module',
          '/^(constant|helpers|hooks|test|utils)/',
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
    'no-console': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 2,
    'prefer-const': [
      2,
      {
        destructuring: 'any',
        ignoreReadBeforeAssign: false,
      },
    ],
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', 'jsx'] }],
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',

    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },
}

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import preferArrow from 'eslint-plugin-prefer-arrow'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import sortExportAll from 'eslint-plugin-sort-export-all'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  ...compat.extends(
    'plugin:@next/next/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:typescript-sort-keys/recommended',
    'prettier',
  ),
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      sourceType: 'module',
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      'prefer-arrow': preferArrow,
      prettier,
      react: react,
      'react-hooks': reactHooks,
      'sort-destructure-keys': sortDestructureKeys,
      'sort-export-all': sortExportAll,
      'unused-imports': unusedImports,
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 2,
      'arrow-body-style': ['error', 'as-needed'],
      'import/no-unresolved': 'off',
      'newline-after-var': [2, 'always'],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-debugger': 'error',
      'prefer-arrow/prefer-arrow-functions': 'warn',
      'prefer-const': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
      ],
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'off',
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.tsx', 'jsx'],
        },
      ],
      'react/jsx-sort-props': 'error',
      'react/no-children-prop': 'error',
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['global', 'jsx', 'object'],
        },
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
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],
      'sort-keys': ['error'],
      'unused-imports/no-unused-imports': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]

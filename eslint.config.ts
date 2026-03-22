import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import eslintPluginImport from 'eslint-plugin-import'
import preferArrow from 'eslint-plugin-prefer-arrow'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys'
import sortExportAll from 'eslint-plugin-sort-export-all'
import unusedImports from 'eslint-plugin-unused-imports'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

export default defineConfig([
  {
    ignores: ['.next', '*.d.ts', '*.mjs', 'coverage', 'out', 'vitest-setup.ts'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  { ...react.configs.flat.recommended },
  { ...react.configs.flat['jsx-runtime'] },

  {
    ...reactHooks.configs['recommended-latest'],
    plugins: {
      'react-hooks': reactHooks as Record<string, unknown>,
    },
  },
  reactCompiler.configs.recommended,

  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,

  ...compat.extends('plugin:typescript-sort-keys/recommended'),

  prettierRecommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    languageOptions: {
      ecmaVersion: 2023,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.vitest,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: 'module',
    },

    plugins: {
      '@next/next': nextPlugin,
      'prefer-arrow': preferArrow,
      'sort-destructure-keys': sortDestructureKeys,
      'sort-export-all': sortExportAll,
      'unused-imports': unusedImports,
    },

    rules: {
      ...nextPlugin.configs.recommended.rules,
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'import/no-unresolved': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
        {
          blankLine: 'any',
          next: ['const', 'let', 'var'],
          prev: ['const', 'let', 'var'],
        },
      ],
      'prefer-arrow/prefer-arrow-functions': 'warn',
      'prefer-const': 'error',
      'prefer-destructuring': ['error', { array: false, object: true }],
      'react/display-name': 'off',
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
      'react/jsx-sort-props': 'error',
      'react/no-children-prop': 'error',
      'react/no-unknown-property': [
        'error',
        { ignore: ['global', 'jsx', 'object'] },
      ],
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      'sort-destructure-keys/sort-destructure-keys': 'error',
      'sort-export-all/sort-export-all': ['error', 'asc', {}],
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-keys': 'error',
      'unused-imports/no-unused-imports': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])

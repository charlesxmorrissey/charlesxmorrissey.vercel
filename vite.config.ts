import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        ref: true,
        svgo: false,
        titleProp: true,
      },
    }),
    tsconfigPaths(),
  ],
  root: '.',
  test: {
    coverage: {
      all: true,
      exclude: ['src/app'],
      include: ['src/**/*.ts?(x)'],
      provider: 'istanbul',
      reporter: ['html', 'json', 'text'],
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest-setup.ts',
    watch: false,
  },
})

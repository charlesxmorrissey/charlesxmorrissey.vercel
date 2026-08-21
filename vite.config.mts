import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
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
  ],
  resolve: {
    tsconfigPaths: true,
  },
  root: '.',
  test: {
    coverage: {
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

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts?(x)', 'tests/unit/**/*.spec.ts?(x)'],
    exclude: ['tests/e2e/**'],
    environment: 'jsdom',
    setupFiles: ['test/setupTests.ts'],
    globals: true,
    css: true,
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/**/__tests__/**', 'src/styles/**', 'src/app/**/layout.tsx'],
    },
  },
});

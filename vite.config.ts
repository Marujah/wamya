/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/wamya.ts'),
      name: 'wamya',
      fileName: 'wamya',
    },
    rollupOptions: {
      external: [/src\/demo\/.*/],
    },
  },
  plugins: [dts()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.(ts|tsx)|**/__tests__/*.(ts|tsx)'],
  },
});
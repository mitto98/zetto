import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  plugins: [dts(), vue()],
  build: {
    sourcemap: true,
    emptyOutDir: false,
    // Reduce bloat from legacy polyfills.
    target: 'esnext',
    // Leave minification up to applications.
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'zetto',
    },
    rollupOptions: {
      external: ['vue', 'lodash'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          lodash: 'lodash',
        },
      },
    },
  },
});

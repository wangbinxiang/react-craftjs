import react from '@vitejs/plugin-react';
// import path from 'node:path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command }) => ({
  // Keep local dev rooted at / while emitting a bundle that can live under /examples/react/.
  base: command === 'build' ? '/examples/react/' : '/',
  test: {
    environment: 'jsdom',
  },
  resolve: {
    // alias: {
    //   '@craftjs/core': path.resolve(__dirname, './src/vendor/craft-core.ts'),
    //   '@craftjs/layers': path.resolve(__dirname, '../../packages/layers/src/index.tsx'),
    //   '@craftjs/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts')
    // }
  },
  plugins: [
    react(),
    svgr({
      // Craft's layers package imports SVGs without the ?react suffix, so the example must transform both forms.
      include: ['**/*.svg', '**/*.svg?react']
    })
  ],
}));

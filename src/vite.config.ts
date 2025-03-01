
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@mendable/firecrawl-js']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['@mendable/firecrawl-js'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/assets/event-app/',
  build: {
    // Generate a manifest file for the custom build.js to read
    manifest: 'manifest.json',
    // Output into an isolated folder
    outDir: 'assets/event-app',
    // Don't empty the outDir outside of this directory (we only empty assets/event-app)
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/event/main.jsx'),
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: For GitHub Pages, set base to your repo name (e.g. '/quizlive/')
// For custom domain or local dev, leave as './'
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/database'],
          'motion-vendor': ['framer-motion'],
        },
      },
    },
  },
});

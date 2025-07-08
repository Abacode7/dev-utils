import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    // Enable code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Monaco Editor into separate chunk
          'monaco-editor': ['@monaco-editor/react', '@monaco-editor/loader'],
          // Split UI components
          'ui-components': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          // Split crypto utilities
          'crypto-utils': ['crypto-js'],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Enable development optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@monaco-editor/react',
    ],
  },
  // Performance hints
  server: {
    hmr: {
      overlay: false, // Disable error overlay for better development experience
    },
  },
})

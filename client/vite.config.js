import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  ],
  server: {
    proxy: {

      '/api': {
        // Dev proxy: point to local backend (override with VITE_PROXY_TARGET if needed)
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Code splitting - load only what's needed
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Split CSS per route (only needed CSS loads)
    cssCodeSplit: true,
    // Optimize images/assets
    assetsInlineLimit: 4096,
  },
})

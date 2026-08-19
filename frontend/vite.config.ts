import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: '/SafeTour-AI/',

  server: {
    port: 5173,
    host: true,
    proxy: {
      '/auth': 'http://localhost:8000',
      '/sos': 'http://localhost:8000',
      '/tourist': 'http://localhost:8000',
      '/geofence': 'http://localhost:8000',
      '/risk': 'http://localhost:8000',
      '/analyze-safety': 'http://localhost:8000',
      '/emergency-alert': 'http://localhost:8000',
      '/nearby-safety': 'http://localhost:8000',
      '/zone-check': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    }
  }
})

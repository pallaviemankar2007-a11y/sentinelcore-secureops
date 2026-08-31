import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This proxy is what solves CORS for local development: the browser thinks
// it's only talking to localhost:5173 (this dev server), and Vite quietly
// forwards anything starting with /api to the real backend at localhost:8080.
// No changes needed on Person A/C's Spring Boot code for this to work locally.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Set host to true to listen on all local IPs (0.0.0.0)
    port: 5174, // Optional: Specify a port (default is 5173)
  },
})

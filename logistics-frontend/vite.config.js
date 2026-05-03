import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy para evitar CORS en desarrollo — redirige /api al backend
    proxy: {
      '/api': {
        target: 'https://sistemalogistico.onrender.com',
        changeOrigin: true,
      },
    },
  },
});

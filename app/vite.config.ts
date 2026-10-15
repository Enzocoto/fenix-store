import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // En GitHub Pages el sitio vive en /<repo>/, así que el build recibe VITE_BASE.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    // Permite exponer el servidor de desarrollo por túneles (p. ej. Cloudflare).
    allowedHosts: ['.trycloudflare.com', '.loca.lt'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});

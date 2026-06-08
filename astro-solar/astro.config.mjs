import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },
  integrations: [
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

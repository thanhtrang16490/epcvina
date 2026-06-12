import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://epcvina.com',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'vi',
        locales: { vi: 'vi-VN' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

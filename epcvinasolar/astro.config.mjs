import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://epcvina.com',
  output: 'static',
  redirects: {
    '/projects': '/du-an',
    '/solar-home/on-grid': '/on-grid',
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
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
      filter: (page) => ![
        'https://epcvina.com/projects/',
        'https://epcvina.com/solar-home/on-grid/',
      ].includes(page),
      i18n: {
        defaultLocale: 'vi',
        locales: { vi: 'vi-VN' },
      },
    }),
  ],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [tailwindcss()],
    esbuild: {
      jsxDev: false,
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vendor chunk: React core
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'react-vendor';
            }
            // Framer-motion in its own chunk (only loaded when needed)
            if (id.includes('node_modules/framer-motion')) {
              return 'framer-motion';
            }
            // Recharts in its own chunk
            if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
              return 'recharts';
            }
            // Supabase
            if (id.includes('node_modules/@supabase')) {
              return 'supabase';
            }
          },
        },
      },
      // Raise the chunk warning threshold slightly (default is 500kB)
      chunkSizeWarningLimit: 600,
    },
  },
});

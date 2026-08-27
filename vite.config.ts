import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      tailwindcss(),

      VitePWA({
        // En desarrollo NO registramos el Service Worker.
        // Esto evita que localhost quede mostrando una versión vieja.
        disable: !isProduction,

        registerType: 'autoUpdate',

        includeAssets: [
          'favicon.svg',
          'icon.svg',
        ],

        manifest: {
          name: 'Punto Bocado Bar | Carta Digital',
          short_name: 'Punto Bocado',
          description:
            'Carta digital interactiva de Punto Bocado Bar. Pedidos por WhatsApp, menú de pastas, pizzas, milanesas y hamburguesas.',
          theme_color: '#0d0d0f',
          background_color: '#0d0d0f',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          lang: 'es',

          icons: [
            {
              src: '/icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/icon.svg',
              sizes: '192x192 512x512',
              type: 'image/svg+xml',
              purpose: 'maskable',
            },
          ],
        },

        workbox: {
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,webp,json}',
          ],

          navigateFallback: '/index.html',

          navigateFallbackDenylist: [
            /^\/api\//,
          ],

          cleanupOutdatedCaches: true,

          clientsClaim: true,

          skipWaiting: true,

          runtimeCaching: [
            {
              urlPattern:
                /^https:\/\/fonts\.googleapis\.com\/.*/i,

              handler: 'CacheFirst',

              options: {
                cacheName: 'google-fonts-cache',

                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds:
                    60 * 60 * 24 * 365,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            {
              urlPattern:
                /^https:\/\/fonts\.gstatic\.com\/.*/i,

              handler: 'CacheFirst',

              options: {
                cacheName: 'gstatic-fonts-cache',

                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds:
                    60 * 60 * 24 * 365,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },

            {
              urlPattern:
                /^https:\/\/images\.unsplash\.com\/.*/i,

              handler: 'StaleWhileRevalidate',

              options: {
                cacheName: 'unsplash-images-cache',

                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds:
                    60 * 60 * 24 * 30,
                },

                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      host: '0.0.0.0',
      port: 3000,

      hmr:
        process.env.DISABLE_HMR !== 'true'
          ? {
              host: 'localhost',
              port: 3000,
              protocol: 'ws',
            }
          : false,

      watch:
        process.env.DISABLE_HMR === 'true'
          ? undefined
          : {},
    },

    preview: {
      host: '0.0.0.0',
      port: 3000,
    },

    build: {
      // Solo controla cuándo Vite muestra el warning.
      // No modifica el funcionamiento de la aplicación.
      chunkSizeWarningLimit: 1200,
    },
  };
});
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const startApp = async () => {
  // El Service Worker se utiliza únicamente en producción.
  if (import.meta.env.PROD) {
    const { registerSW } = await import('virtual:pwa-register');

    registerSW({
      immediate: true,

      onNeedRefresh() {
        console.log(
          'Nueva versión de la carta disponible.'
        );

        window.dispatchEvent(
          new CustomEvent('sw:need-refresh')
        );
      },

      onOfflineReady() {
        console.log(
          'Carta digital lista para funcionar sin conexión.'
        );

        window.dispatchEvent(
          new CustomEvent('sw:offline-ready')
        );
      },

      onRegisteredSW(swUrl, registration) {
        console.log(
          'Service Worker registrado:',
          swUrl
        );

        // Comprobar periódicamente si hay una nueva versión.
        if (registration) {
          setInterval(() => {
            registration.update().catch(() => {
              // Ignorar errores de actualización.
            });
          }, 60 * 60 * 1000);
        }
      },

      onRegisterError(error) {
        console.error(
          'Error registrando Service Worker:',
          error
        );
      },
    });
  }

  createRoot(
    document.getElementById('root')!
  ).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

startApp();
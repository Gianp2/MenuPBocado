import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register service worker for instant offline loading and PWA caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nueva versión de la carta disponible.');
  },
  onOfflineReady() {
    console.log('Carta digital lista para funcionar sin conexión.');
    window.dispatchEvent(new CustomEvent('sw:offline-ready'));
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

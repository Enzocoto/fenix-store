import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { CartProvider } from './state/CartProvider';
import { I18nProvider } from './i18n/I18nProvider';
import { applyTheme } from './config/theme';
import { captureAttribution, trackPageview } from './lib/analytics';
import './styles/global.css';

applyTheme();
captureAttribution();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <I18nProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </I18nProvider>
  </StrictMode>,
);

trackStorePageview();
window.addEventListener('hashchange', () => {
  captureAttribution();
  trackStorePageview();
});

function trackStorePageview(): void {
  const path = window.location.hash.replace(/^#/, '') || '/';
  if (path.startsWith('/portal') || path.startsWith('/admin')) return;
  trackPageview(path);
}

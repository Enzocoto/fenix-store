import { useEffect } from 'react';
import { brand } from './data/brand';
import { product } from './data/product';
import { useRoute } from './lib/router';
import { useI18n } from './hooks/useI18n';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OwnerPortalPage } from './pages/OwnerPortalPage';

export function App() {
  const route = useRoute();
  const { lang, t } = useI18n();

  useEffect(() => {
    const titles: Record<typeof route, string> = {
      home: `${brand.name} — ${product.shortName[lang]}`,
      product: `${product.name[lang]} | ${brand.name}`,
      cart: `${t('cart.title')} | ${brand.name}`,
      checkout: `${t('checkout.title')} | ${brand.name}`,
      portal: `Owner Portal | ${brand.name}`,
      admin: `Panel privado | ${brand.name}`,
    };
    document.title = titles[route];
    if (import.meta.env.MODE === 'test') {
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route, lang, t]);

  if (route === 'portal' || route === 'admin') {
    return <OwnerPortalPage />;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">
        {route === 'home' ? <HomePage /> : null}
        {route === 'product' ? <ProductPage /> : null}
        {route === 'cart' ? <CartPage /> : null}
        {route === 'checkout' ? <CheckoutPage /> : null}
      </main>
      <Footer />
    </>
  );
}

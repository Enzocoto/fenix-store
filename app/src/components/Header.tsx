import { brand } from '../data/brand';
import { useCart } from '../hooks/useCart';
import { useI18n } from '../hooks/useI18n';
import { LanguageSwitcher } from './LanguageSwitcher';

function LogoMark() {
  return (
    <svg className="logo__mark" viewBox="0 0 48 48" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0f3d3e" />
      <path d="M12 30c0-6 5-11 12-11s12 5 12 11v6H12z" fill="#f2a541" />
      <circle cx="18" cy="30" r="2.6" fill="#0f3d3e" />
      <circle cx="30" cy="30" r="2.6" fill="#0f3d3e" />
      <path d="M20 36c1.6 2 6.4 2 8 0" stroke="#0f3d3e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { count } = useCart();
  const { t } = useI18n();

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <a className="logo" href="#/" aria-label={t('header.logoAria')}>
          <LogoMark />
          {brand.name}
        </a>
        <nav className="nav" aria-label="Main">
          <a href="#/">{t('nav.home')}</a>
          <a href="#/product">{t('nav.product')}</a>
          <a href="#/cart">{t('nav.cart')}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <a className="cart-button" href="#/cart" aria-label={t('header.cartAria', { count })}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 4h2l2.4 12.3a1 1 0 0 0 1 .7h8.7a1 1 0 0 0 1-.8L20 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
            <span className="cart-count" aria-hidden="true">
              {count}
            </span>
          </a>
          <a className="button button--accent header-cta" href="#/product">
            {t('header.shopNow')}
          </a>
        </div>
      </div>
    </header>
  );
}

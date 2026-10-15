import { brand } from '../data/brand';
import { useI18n } from '../hooks/useI18n';

export function Footer() {
  const { t, lang } = useI18n();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="logo" style={{ color: '#fff', marginBottom: 10 }}>
            {brand.name}
          </div>
          <p style={{ color: '#c7dedb', maxWidth: '38ch' }}>{brand.tagline[lang]}</p>
          <p style={{ color: '#9fbdb9', fontSize: '0.85rem' }}>{t('footer.disclaimer')}</p>
        </div>
        <div>
          <h3>{t('footer.shop')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            <li>
              <a href="#/product">{t('footer.theCover')}</a>
            </li>
            <li>
              <a href="#/cart">{t('nav.cart')}</a>
            </li>
            <li>
              <a href="#/checkout">{t('footer.checkout')}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t('footer.contact')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            <li>
              <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>
            </li>
            <li>{t('footer.shipsTo', { country: brand.country[lang] })}</li>
          </ul>
        </div>
      </div>
      <div className="container">
        <div className="footer-bottom">
          <span>{t('footer.rights', { year: new Date().getFullYear(), brand: brand.name })}</span>
          <span>{t('footer.pricesIn', { currency: brand.currency })}</span>
        </div>
      </div>
    </footer>
  );
}

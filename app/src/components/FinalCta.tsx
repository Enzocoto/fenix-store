import { useI18n } from '../hooks/useI18n';

export function FinalCta() {
  const { t } = useI18n();
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div className="cta-band__copy">
          <h2>{t('home.ctaTitle')}</h2>
          <p>{t('home.ctaBody')}</p>
        </div>
        <a className="button button--accent" href="#/product">
          {t('home.ctaButton')}
        </a>
      </div>
    </section>
  );
}

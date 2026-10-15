import { product } from '../data/product';
import { brand } from '../data/brand';
import { useI18n } from '../hooks/useI18n';
import { formatMoney } from '../lib/money';
import { Photo } from '../components/Photo';
import { heroPhoto, productPhotos, photoNotice } from '../data/media';
import { FaqList } from '../components/FaqList';
import { TrustRow } from '../components/TrustRow';
import { ProvisionalTag } from '../components/ProvisionalTag';
import { ComparisonTable } from '../components/ComparisonTable';
import { UseCases } from '../components/UseCases';
import { ReviewsSection } from '../components/ReviewsSection';
import { FinalCta } from '../components/FinalCta';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.4 2.9 8.3 7 10 4.1-1.7 7-5.6 7-10V6z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 10 3 5l4 1.5M19 10l2-5-4 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10c0 3.9 3.1 7 7 7s7-3.1 7-7" strokeLinecap="round" />
      <circle cx="9.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="11.5" r="1" fill="currentColor" stroke="none" />
      <path d="M11 14.5h2" strokeLinecap="round" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 3.5C9 7 6.5 9.8 6.5 13a5.5 5.5 0 0 0 11 0c0-3.2-2.5-6-5.5-9.5Z" strokeLinejoin="round" />
      <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" strokeLinecap="round" />
    </svg>
  );
}

export function HomePage() {
  const { t, lang } = useI18n();
  const minPrice = Math.min(...product.variants.map((variant) => variant.priceCents));
  const fromPrice = formatMoney(minPrice, product.currency, brand.locale[lang]);

  return (
    <>
      <section className="hero">
        <div className="hero__inner container">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">{t('hero.eyebrow')}</p>
            <h1>{t('hero.title')}</h1>
            <p className="hero__subtitle">{t('hero.subtitle')}</p>
            <div className="hero__actions">
              <a className="button button--accent" href="#/product">
                {t('hero.seeCover')}
              </a>
              <button
                type="button"
                className="button button--ghost button--ghost-light"
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.questions')}
              </button>
            </div>
            <p className="hero__note">
              {t('hero.fromPrice', { price: fromPrice })} <ProvisionalTag />
            </p>
            <ul className="hero__chips">
              <li>{t('hero.trust1')}</li>
              <li>{t('hero.trust2')}</li>
              <li>{t('hero.trust3')}</li>
            </ul>
          </div>
          <div className="hero__art">
            <Photo base={heroPhoto.base} alt={heroPhoto.alt} className="hero__photo" loading="eager" sizes="(min-width: 900px) 560px, 100vw" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t('home.valueEyebrow')}</p>
          <h2>{t('home.valueTitle')}</h2>
          <div className="grid cards-3">
            {valueCards.map((card) => (
              <article className="card" key={card.title}>
                <div className="card__icon" aria-hidden="true">
                  <card.icon />
                </div>
                <h3>{t(card.title)}</h3>
                <p>{t(card.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container expect-grid">
          <div className="expect-grid__media">
            <Photo base={productPhotos[2].base} alt={productPhotos[2].alt} className="expect-photo" sizes="(min-width: 900px) 520px, 100vw" />
          </div>
          <div>
            <p className="eyebrow">{t('home.expectEyebrow')}</p>
            <h2>{t('home.expectTitle')}</h2>
            <ul className="lede feature-list">
              {product.highlights.map((highlight) => {
                const text = highlight[lang];
                return (
                  <li key={highlight.en}>
                    {text.replace('[PROVISIONAL]', '').trim()} {text.includes('[PROVISIONAL]') ? <ProvisionalTag /> : null}
                  </li>
                );
              })}
            </ul>
            <a className="button button--primary" href="#/product">
              {t('home.viewDetails')}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t('home.compareEyebrow')}</p>
          <h2>{t('home.compareTitle')}</h2>
          <p className="lede">{t('home.compareLede')}</p>
          <ComparisonTable />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <p className="eyebrow">{t('home.useEyebrow')}</p>
          <h2>{t('home.useTitle')}</h2>
          <UseCases />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t('home.howEyebrow')}</p>
          <h2>{t('home.howTitle')}</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step" key={step.title}>
                <span className="step__num" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className="step__title">{t(step.title)}</h3>
                  <p className="step__body">{t(step.body)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <TrustRow />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ReviewsSection />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t('home.faqEyebrow')}</p>
          <h2>{t('home.faqTitle')}</h2>
          <FaqList items={product.faq} />
          <p className="photo-notice">{photoNotice[lang]}</p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

const valueCards = [
  { icon: ShieldIcon, title: 'home.value1Title', body: 'home.value1Body' },
  { icon: DogIcon, title: 'home.value2Title', body: 'home.value2Body' },
  { icon: DropIcon, title: 'home.value3Title', body: 'home.value3Body' },
] as const;

const steps = [
  { title: 'home.step1Title', body: 'home.step1Body' },
  { title: 'home.step2Title', body: 'home.step2Body' },
  { title: 'home.step3Title', body: 'home.step3Body' },
  { title: 'home.step4Title', body: 'home.step4Body' },
] as const;

import { useState } from 'react';
import { product } from '../data/product';
import { ProductGallery } from '../components/ProductGallery';
import { ProductVideo } from '../components/ProductVideo';
import { PriceTag } from '../components/PriceTag';
import { ProvisionalTag } from '../components/ProvisionalTag';
import { QuantityStepper } from '../components/QuantityStepper';
import { FaqList } from '../components/FaqList';
import { TrustRow } from '../components/TrustRow';
import { ComparisonTable } from '../components/ComparisonTable';
import { ReviewsSection } from '../components/ReviewsSection';
import { FinalCta } from '../components/FinalCta';
import { useCart } from '../hooks/useCart';
import { useI18n } from '../hooks/useI18n';
import { navigate } from '../lib/router';

export function ProductPage() {
  const { add } = useCart();
  const { t, lang } = useI18n();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  function handleAdd() {
    add(
      {
        slug: product.slug,
        name: product.name.en,
        variantId: variant.id,
        variantLabel: variant.label.en,
        unitPriceCents: variant.priceCents,
      },
      quantity,
    );
    setAdded(true);
  }

  return (
    <div className="container product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">{t('product.home')}</a> / {product.shortName[lang]}
      </nav>

      <div className="product-layout" style={{ marginTop: 18 }}>
        <ProductGallery />

        <div className="buy-box">
          <h1>{product.name[lang]}</h1>
          <p className="lede">{product.subtitle[lang]}</p>

          <div className="buy-row" style={{ marginBottom: 12 }}>
            <PriceTag cents={variant.priceCents} compareAtCents={product.compareAtCents} />
            <ProvisionalTag />
          </div>

          <fieldset className="variant-fieldset">
            <legend className="option__label">{t('product.chooseSize')}</legend>
            <div className="option-list">
              {product.variants.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="option"
                  aria-pressed={variantId === item.id}
                  onClick={() => setVariantId(item.id)}
                >
                  <span className="option__label">{item.label[lang]}</span>
                  <PriceTag cents={item.priceCents} />
                </button>
              ))}
            </div>
          </fieldset>

          <div className="buy-row">
            <QuantityStepper value={quantity} onChange={setQuantity} label={t('product.quantityLabel')} />
            <button type="button" className="button button--accent" onClick={handleAdd}>
              {t('product.addToCart')}
            </button>
          </div>

          {added ? (
            <p className="badge" role="status" style={{ marginTop: 14 }}>
              {t('product.added')}{' '}
              <a href="#/cart" onClick={() => navigate('cart')}>
                {t('product.viewCart')}
              </a>
            </p>
          ) : null}

          <TrustRow />

          <div className="card" style={{ marginTop: 18 }}>
            <h3>{t('product.included')}</h3>
            <ul className="included-list">
              {product.includes.map((item) => (
                <li key={item.en}>{item[lang]}</li>
              ))}
            </ul>
          </div>

          <p className="note-text">
            {product.shippingNote[lang]} {product.returnNote[lang]}
          </p>
        </div>
      </div>

      <section className="section">
        <h2>{t('product.videoTitle')}</h2>
        <ProductVideo />
        <p className="lede notice-inline">
          {t('product.videoNote')} <ProvisionalTag />
        </p>
      </section>

      <section className="section">
        <h2>{t('product.features')}</h2>
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
      </section>

      <section className="section">
        <p className="eyebrow">{t('home.compareEyebrow')}</p>
        <h2>{t('home.compareTitle')}</h2>
        <p className="lede">{t('home.compareLede')}</p>
        <ComparisonTable />
      </section>

      <section className="section">
        <h2>{t('product.specsTitle')}</h2>
        <p className="lede notice-inline">{t('product.specsNote')}</p>
        <table className="spec-table">
          <tbody>
            {product.specs.map((spec) => (
              <tr key={spec.label.en}>
                <th scope="row">{spec.label[lang]}</th>
                <td>{spec.value[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2>{t('product.questions')}</h2>
        <FaqList items={product.faq} />
      </section>

      <section className="section">
        <ReviewsSection />
      </section>

      <FinalCta />

      <div className="sticky-cta" aria-hidden="false">
        <div className="sticky-cta__inner">
          <div>
            <span className="sticky-cta__label">{variant.label[lang]}</span>
            <PriceTag cents={variant.priceCents} />
          </div>
          <button type="button" className="button button--accent" onClick={handleAdd}>
            {t('product.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}

import { product } from '../data/product';
import { brand } from '../data/brand';
import { formatMoney } from '../lib/money';
import { useCart } from '../hooks/useCart';
import { useI18n } from '../hooks/useI18n';
import { QuantityStepper } from '../components/QuantityStepper';
import { ProductArtwork } from '../components/ProductArtwork';
import { ProvisionalTag } from '../components/ProvisionalTag';

export function CartPage() {
  const { cart, subtotalCents, setQuantity, remove, count } = useCart();
  const { t, lang } = useI18n();
  const locale = brand.locale[lang];

  function variantLabel(variantId: string, fallback: string) {
    return product.variants.find((item) => item.id === variantId)?.label[lang] ?? fallback;
  }

  if (cart.length === 0) {
    return (
      <div className="container section">
        <h1>{t('cart.title')}</h1>
        <p className="lede">{t('cart.empty')}</p>
        <a className="button button--primary" href="#/product">
          {t('cart.shop')}
        </a>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>{t('cart.title')}</h1>
      <p className="lede">{t('cart.itemsCount', { count })}</p>

      <div className="product-layout" style={{ marginTop: 18 }}>
        <div>
          {cart.map((line) => (
            <div className="cart-line" key={line.key}>
              <div className="cart-line__thumb">
                <ProductArtwork view="overview" />
              </div>
              <div>
                <p className="cart-line__title">{product.name[lang]}</p>
                <p className="cart-line__meta">{variantLabel(line.variantId, line.variantLabel)}</p>
                <QuantityStepper
                  value={line.quantity}
                  onChange={(value) => setQuantity(line.key, value)}
                  label={t('product.quantityLabel')}
                />
              </div>
              <div className="cart-line__aside">
                <p className="price price--sm">{formatMoney(line.unitPriceCents * line.quantity, brand.currency, locale)}</p>
                <button type="button" className="cart-line__remove" onClick={() => remove(line.key)}>
                  {t('cart.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="summary" aria-label={t('cart.summary')}>
          <h2 className="summary__title">{t('cart.summary')}</h2>
          <div className="summary__row">
            <span>{t('cart.subtotal')}</span>
            <span>{formatMoney(subtotalCents, brand.currency, locale)}</span>
          </div>
          <div className="summary__row">
            <span>{t('cart.shipping')}</span>
            <span className="summary__prov">
              {t('cart.shippingCalc')} <ProvisionalTag />
            </span>
          </div>
          <div className="summary__row summary__row--total">
            <span>{t('cart.total')}</span>
            <span>{formatMoney(subtotalCents, brand.currency, locale)}</span>
          </div>
          <a className="button button--accent button--block" href="#/checkout">
            {t('cart.checkout')}
          </a>
          <p className="note-text">{t('cart.demoNote')}</p>
        </aside>
      </div>
    </div>
  );
}

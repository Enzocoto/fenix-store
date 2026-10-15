import { useEffect, useState, type FormEvent } from 'react';
import { brand } from '../data/brand';
import { product } from '../data/product';
import { formatMoney } from '../lib/money';
import { api, type CheckoutPayload } from '../lib/api';
import { getAttribution } from '../lib/analytics';
import { apiEnabled, site } from '../config/site';
import { useCart } from '../hooks/useCart';
import { useI18n } from '../hooks/useI18n';
import { ProvisionalTag } from '../components/ProvisionalTag';
import type { TranslationKey } from '../i18n/translations';

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const emptyForm: FormState = { name: '', email: '', address: '', city: '', state: '', zip: '' };

interface CheckoutReturn {
  reference: string;
}

function demoReference(): string {
  return `DEMO-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

/** Reads the `#/checkout?status=success&order=...` return from Stripe. */
function readCheckoutReturn(): CheckoutReturn | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const index = hash.indexOf('?');
  if (index < 0) return null;
  const params = new URLSearchParams(hash.slice(index + 1));
  if (params.get('status') !== 'success') return null;
  const order = params.get('order')?.trim();
  return { reference: order || demoReference() };
}

const fieldLabels: Record<keyof FormState, TranslationKey> = {
  name: 'checkout.name',
  email: 'checkout.email',
  address: 'checkout.address',
  city: 'checkout.city',
  state: 'checkout.state',
  zip: 'checkout.zip',
};

export function CheckoutPage() {
  const { cart, subtotalCents, count, clear } = useCart();
  const { t, lang } = useI18n();
  const locale = brand.locale[lang];
  const [checkoutReturn] = useState(readCheckoutReturn);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, TranslationKey>>>({});
  const [reference, setReference] = useState<string | null>(checkoutReturn?.reference ?? null);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    if (checkoutReturn) {
      clear();
    }
  }, [checkoutReturn, clear]);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, TranslationKey>> = {};
    if (!form.name.trim()) next.name = 'error.name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'error.email';
    if (!form.address.trim()) next.address = 'error.address';
    if (!form.city.trim()) next.city = 'error.city';
    if (!form.state.trim()) next.state = 'error.state';
    if (!/^\d{5}(-\d{4})?$/.test(form.zip)) next.zip = 'error.zip';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    setSubmitError(false);

    const items = cart.map((line) => ({
      slug: line.slug,
      variantId: line.variantId,
      quantity: line.quantity,
    }));
    const attribution = getAttribution();

    if (apiEnabled && items.length > 0) {
      try {
        const payload: CheckoutPayload = {
          storeId: site.storeId,
          email: form.email,
          name: form.name,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          referrer: attribution.referrer,
          utm: {
            source: attribution.source,
            medium: attribution.medium,
            campaign: attribution.campaign,
            content: attribution.content,
            term: attribution.term,
          },
          items,
        };
        const result = await api.checkout(payload);
        if (result.mode === 'live' && result.url) {
          window.location.href = result.url;
          return;
        }
        setReference(result.orderId ? `DEMO-${result.orderId.slice(0, 6).toUpperCase()}` : demoReference());
        clear();
        return;
      } catch {
        // El servidor de pago no respondió: NO confirmamos el pedido ni vaciamos
        // el carrito. Mostramos un error para que el usuario pueda reintentar.
        setSubmitError(true);
        return;
      }
    }

    // Sin backend configurado (apiEnabled=false): checkout de demostración local.
    setReference(demoReference());
    clear();
  }

  if (reference) {
    const live = Boolean(checkoutReturn);
    return (
      <div className="container section">
        <div className="card confirm-card">
          <p className="eyebrow">{t(live ? 'checkout.confirmLiveEyebrow' : 'checkout.confirmEyebrow')}</p>
          <h1>{t('checkout.confirmTitle', { ref: reference })}</h1>
          <p className="lede">{t(live ? 'checkout.confirmLiveBody' : 'checkout.confirmBody')}</p>
          <a className="button button--primary" href="#/product">
            {t('checkout.back')}
          </a>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container section">
        <h1>{t('checkout.title')}</h1>
        <p className="lede">{t('checkout.empty')}</p>
        <a className="button button--primary" href="#/product">
          {t('cart.shop')}
        </a>
      </div>
    );
  }

  function variantLabel(variantId: string, fallback: string) {
    return product.variants.find((item) => item.id === variantId)?.label[lang] ?? fallback;
  }

  return (
    <div className="container section">
      <h1>{t('checkout.title')}</h1>
      <p className="lede">
        {t('checkout.lede')} <ProvisionalTag />
      </p>

      <div className="product-layout" style={{ marginTop: 18 }}>
        <form className="card" onSubmit={handleSubmit} noValidate>
          <h2 className="summary__title">{t('checkout.formTitle')}</h2>

          {(Object.keys(fieldLabels) as (keyof FormState)[])
            .filter((field) => field !== 'city' && field !== 'state' && field !== 'zip')
            .map((field) => (
              <div className="field" key={field}>
                <label htmlFor={field}>{t(fieldLabels[field])}</label>
                <input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field]}
                  onChange={(event) => update(field, event.target.value)}
                  aria-invalid={Boolean(errors[field])}
                />
                {errors[field] ? <p className="field-error">{t(errors[field]!)}</p> : null}
              </div>
            ))}

          <div className="field-grid">
            {(['city', 'state', 'zip'] as const).map((field) => (
              <div className="field" key={field}>
                <label htmlFor={field}>{t(fieldLabels[field])}</label>
                <input
                  id={field}
                  value={form[field]}
                  onChange={(event) => update(field, event.target.value)}
                  aria-invalid={Boolean(errors[field])}
                />
                {errors[field] ? <p className="field-error">{t(errors[field]!)}</p> : null}
              </div>
            ))}
          </div>

          <p className="notice notice--provisional">{t('checkout.demoNote')}</p>

          {submitError ? (
            <p className="field-error" role="alert">
              {t('checkout.error')}
            </p>
          ) : null}

          <button type="submit" className="button button--primary button--block">
            {t('checkout.place')}
          </button>
        </form>

        <aside className="summary" aria-label={t('checkout.summary')}>
          <h2 className="summary__title">{t('checkout.summary')}</h2>
          {cart.map((line) => (
            <div className="summary__row" key={line.key}>
              <span>{t('checkout.orderLine', { label: variantLabel(line.variantId, line.variantLabel), qty: line.quantity })}</span>
              <span>{formatMoney(line.unitPriceCents * line.quantity, brand.currency, locale)}</span>
            </div>
          ))}
          <div className="summary__row summary__row--total">
            <span>{t('checkout.subtotalCount', { count })}</span>
            <span>{formatMoney(subtotalCents, brand.currency, locale)}</span>
          </div>
          <p className="note-text">{t('checkout.taxNote')}</p>
        </aside>
      </div>
    </div>
  );
}

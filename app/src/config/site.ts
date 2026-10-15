import type { Lang, Localized } from '../lib/lang';

const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

/**
 * Configuración central y GENÉRICA de la tienda.
 * Para reciclar el proyecto a otra temática se cambian estos valores
 * (nombre, storeId, colores, textos) y las fotos; la lógica no se toca.
 *
 * El backend (API) se activa solo cuando defines VITE_API_URL.
 * Sin ella, la web funciona como escaparate estático (sin analítica ni cobro).
 */
export const site = {
  name: 'Fenix',
  storeId: 'fenix-dog-gear',
  productSlug: 'backseat-hammock-cover',
  domain: 'fenix.example',
  supportEmail: 'support@fenix.example',
  currency: 'USD',
  apiBaseUrl,
  locale: { en: 'en-US', es: 'es-US' } as Record<Lang, string>,
  tagline: {
    en: 'Everyday gear, chosen with care.',
    es: 'Productos para el día a día, elegidos con cuidado.',
  } satisfies Localized,
  country: {
    en: 'the United States',
    es: 'Estados Unidos',
  } satisfies Localized,
  theme: {
    brand: '#0f3d3e',
    brandStrong: '#08292a',
    brandSoft: '#e2eeee',
    accent: '#f2a541',
    accentStrong: '#c97f1f',
    surfaceAlt: '#f7f5ef',
  },
} as const;

export const apiEnabled = Boolean(apiBaseUrl);

export type Site = typeof site;

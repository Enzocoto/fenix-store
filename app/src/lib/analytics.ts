import { api } from './api';
import { apiEnabled, site } from '../config/site';

export interface Attribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrer?: string;
  sessionId: string;
}

const STORE_KEY = 'fenix:attribution:v1';
const SESSION_KEY = 'fenix:session:v1';

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function queryParams(): URLSearchParams {
  const params = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  if (typeof window === 'undefined') return params;
  const hash = window.location.hash;
  const index = hash.indexOf('?');
  if (index >= 0) {
    new URLSearchParams(hash.slice(index + 1)).forEach((value, key) => params.set(key, value));
  }
  return params;
}

export function sessionId(): string {
  let id = safeGet(SESSION_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    safeSet(SESSION_KEY, id);
  }
  return id;
}

/** Primera visita con UTM (first-touch). Se guarda una sola vez. */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  const params = queryParams();
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const hasUtm = keys.some((k) => params.get(k));
  if (!hasUtm || safeGet(STORE_KEY)) return;
  const first = {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
    term: params.get('utm_term') ?? undefined,
    referrer: document.referrer || undefined,
  };
  safeSet(STORE_KEY, JSON.stringify(first));
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') {
    return { sessionId: 'server' };
  }
  const params = queryParams();
  let first: Partial<Attribution> = {};
  const stored = safeGet(STORE_KEY);
  if (stored) {
    try {
      first = JSON.parse(stored) as Partial<Attribution>;
    } catch {
      first = {};
    }
  }
  const current: Partial<Attribution> = {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
    term: params.get('utm_term') ?? undefined,
  };
  const hasCurrent = Boolean(current.source || current.medium || current.campaign);
  const merged = hasCurrent ? { ...first, ...current } : first;
  return {
    source: merged.source,
    medium: merged.medium,
    campaign: merged.campaign,
    content: merged.content,
    term: merged.term,
    referrer: merged.referrer ?? (document.referrer || undefined),
    sessionId: sessionId(),
  };
}

export function trackPageview(path: string): void {
  if (typeof window === 'undefined' || !apiEnabled) return;
  const attribution = getAttribution();
  void api
    .track({
      path,
      storeId: site.storeId,
      productSlug: path.startsWith('/product') ? site.productSlug : undefined,
      referrer: attribution.referrer,
      source: attribution.source,
      medium: attribution.medium,
      campaign: attribution.campaign,
      content: attribution.content,
      term: attribution.term,
      sessionId: attribution.sessionId,
    })
    .catch(() => {
      /* best-effort: no bloquea la web */
    });
}

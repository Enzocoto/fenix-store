import { site } from '../config/site';

const BASE = site.apiBaseUrl.replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface Product {
  id: string;
  store_id?: string | null;
  slug: string;
  name: string;
  price_cents: number;
  currency: string;
}

export interface FinanceSummary {
  revenueCents: number;
  cogsCents: number;
  feesCents: number;
  grossProfitCents: number;
  netProfitCents: number;
  margin: number;
  paidOrders: number;
}

export interface AnalyticsResponse {
  bySource: { source: string | null; visits: number }[];
  byMedium: { medium: string | null; visits: number }[];
  byCampaign: { campaign: string | null; visits: number }[];
  ordersBySource: { source: string | null; orders: number; revenue_cents: number }[];
}

export interface AdminSummary {
  finance: FinanceSummary;
  visits: number;
  totalOrders: number;
  paidOrders: number;
  visitsBySource: Record<string, number>;
}

export interface PortfolioStore {
  id: string;
  slug: string;
  name: string;
  domain?: string | null;
  currency: string;
  active: boolean;
  visits: number;
  totalOrders: number;
  paidOrders: number;
  revenueCents: number;
  netProfitCents: number;
  margin: number;
  conversion: number;
}

export interface PortfolioProduct {
  id: string;
  store_id: string;
  storeName: string;
  slug: string;
  name: string;
  price_cents: number;
  currency: string;
  visits: number;
  totalOrders: number;
  paidOrders: number;
  revenueCents: number;
  conversion: number;
}

export interface PortfolioResponse {
  finance: FinanceSummary;
  visits: number;
  totalOrders: number;
  paidOrders: number;
  stores: PortfolioStore[];
  products: PortfolioProduct[];
  traffic: {
    bySource: { storeId: string | null; source: string | null; visits: number }[];
    byCampaign: { storeId: string | null; campaign: string | null; visits: number }[];
  };
}

export interface CheckoutItem {
  slug: string;
  variantId: string;
  quantity: number;
}

export interface CheckoutUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface CheckoutPayload {
  storeId: string;
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  referrer?: string;
  utm?: CheckoutUtm;
  items: CheckoutItem[];
}

export interface CheckoutResponse {
  mode: 'demo' | 'live';
  orderId: string;
  amountCents?: number;
  currency?: string;
  url?: string;
}

export const api = {
  base: BASE,
  health: () => request<{ ok: boolean }>('/api/health'),
  products: (storeId?: string) => request<{ products: Product[] }>(`/api/products${storeId ? `?storeId=${encodeURIComponent(storeId)}` : ''}`),
  track: (payload: unknown) => request<void>('/api/track', { method: 'POST', body: JSON.stringify(payload) }),
  checkout: (payload: CheckoutPayload) =>
    request<CheckoutResponse>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  adminLogin: (email: string, password: string) =>
    request<{ token: string; email: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  adminSummary: (token: string) => request<AdminSummary>('/api/admin/summary', { headers: auth(token) }),
  adminOrders: (token: string) =>
    request<{ orders: Record<string, unknown>[] }>('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
  adminAnalytics: (token: string) =>
    request<AnalyticsResponse>('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } }),
  adminFinance: (token: string) =>
    request<FinanceSummary>('/api/admin/finance', { headers: { Authorization: `Bearer ${token}` } }),
  adminPortfolio: (token: string) => request<PortfolioResponse>('/api/admin/portfolio', { headers: auth(token) }),
};

function auth(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

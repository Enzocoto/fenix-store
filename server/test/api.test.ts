import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createPool } from '../src/db/pool';
import { bootstrap } from '../src/db/init';
import { createApp } from '../src/app';

let app: Express;
let token = '';
let orderId = '';

beforeAll(async () => {
  const db = createPool();
  await bootstrap(db);
  app = createApp(db);
});

describe('Fenix API', () => {
  it('responds to health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('lists seeded products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products[0].slug).toBe('backseat-hammock-cover');
  });

  it('filters products by storefront', async () => {
    const dog = await request(app).get('/api/products?storeId=fenix-dog-gear');
    const home = await request(app).get('/api/products?storeId=fenix-home');
    expect(dog.body.products).toHaveLength(1);
    expect(dog.body.products[0].store_id).toBe('fenix-dog-gear');
    expect(home.body.products).toHaveLength(0);
  });

  it('records a visit with attribution', async () => {
    const res = await request(app)
      .post('/api/track')
      .send({ path: '/', storeId: 'fenix-dog-gear', productSlug: 'backseat-hammock-cover', source: 'tiktok', campaign: 'launch1', medium: 'social' });
    expect(res.status).toBe(204);
  });

  it('creates a demo order', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ storeId: 'fenix-dog-gear', slug: 'backseat-hammock-cover', quantity: 1, utm: { source: 'tiktok' } });
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('demo');
    orderId = res.body.orderId;
  });

  it('logs in as admin', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@test.local', password: 'test-password' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    token = res.body.token;
  });

  it('rejects unauthorized admin access', async () => {
    const res = await request(app).get('/api/admin/summary');
    expect(res.status).toBe(401);
  });

  it('computes finance after a paid order', async () => {
    const db = app.locals.db;
    await db.query("update orders set status='paid', paid_at=now() where group_id=$1 or id=$1", [orderId]);
    const res = await request(app).get('/api/admin/finance').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.revenueCents).toBe(3999);
    expect(res.body.cogsCents).toBe(1200);
    expect(res.body.netProfitCents).toBeLessThan(3999);
    expect(res.body.margin).toBeGreaterThan(0.5);
  });

  it('aggregates analytics by source', async () => {
    const res = await request(app).get('/api/admin/analytics').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.bySource.some((r: { source: string }) => r.source === 'tiktok')).toBe(true);
    expect(res.body.ordersBySource.some((r: { source: string }) => r.source === 'tiktok')).toBe(true);
  });

  it('returns the owner portfolio grouped by store and product', async () => {
    const res = await request(app).get('/api/admin/portfolio').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.stores.some((store: { id: string }) => store.id === 'fenix-dog-gear')).toBe(true);
    expect(res.body.stores.some((store: { id: string }) => store.id === 'fenix-home')).toBe(true);
    expect(res.body.products.some((product: { slug: string }) => product.slug === 'backseat-hammock-cover')).toBe(true);
    expect(res.body.products.find((product: { slug: string }) => product.slug === 'backseat-hammock-cover').visits).toBe(1);
    expect(res.body.finance.revenueCents).toBe(3999);
  });

  it('checkout with variantId xl and quantity 2 → amountCents 8998 and variant_id xl', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({
        storeId: 'fenix-dog-gear',
        email: 'a@b.com',
        name: 'Jane',
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        referrer: 'https://example.com',
        utm: { source: 'tiktok', medium: 'social', campaign: 'spring', content: 'ad1', term: 'dog' },
        items: [{ slug: 'backseat-hammock-cover', variantId: 'xl', quantity: 2 }],
      });
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('demo');
    expect(res.body.amountCents).toBe(8998);
    const db = app.locals.db;
    const rows = await db.query('select * from orders where group_id = $1', [res.body.orderId]);
    expect(rows.rows.length).toBe(1);
    expect(rows.rows[0].variant_id).toBe('xl');
    expect(rows.rows[0].email).toBe('a@b.com');
    expect(rows.rows[0].customer_name).toBe('Jane');
    expect(rows.rows[0].address).toBe('123 Main St');
    expect(rows.rows[0].city).toBe('Austin');
    expect(rows.rows[0].region).toBe('TX');
    expect(rows.rows[0].postal_code).toBe('78701');
    expect(rows.rows[0].utm_source).toBe('tiktok');
    expect(rows.rows[0].referrer).toBe('https://example.com');
  });

  it('checkout multi-line creates 2 rows same group_id with correct amounts', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({
        storeId: 'fenix-dog-gear',
        email: 'a@b.com',
        name: 'Jane',
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        referrer: 'https://example.com',
        utm: { source: 'tiktok', medium: 'social', campaign: 'spring', content: 'ad1', term: 'dog' },
        items: [
          { slug: 'backseat-hammock-cover', variantId: 'std', quantity: 1 },
          { slug: 'backseat-hammock-cover', variantId: 'xl', quantity: 1 },
        ],
      });
    expect(res.status).toBe(200);
    expect(res.body.mode).toBe('demo');
    expect(res.body.amountCents).toBe(8498);
    const db = app.locals.db;
    const rows = await db.query('select * from orders where group_id = $1 order by variant_id', [res.body.orderId]);
    expect(rows.rows.length).toBe(2);
    expect(rows.rows[0].group_id).toBe(rows.rows[1].group_id);
  });

  it('rejects checkout without storeId', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ slug: 'backseat-hammock-cover', quantity: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_body');
  });

  it('rejects an unknown variantId instead of charging the base price', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({
        storeId: 'fenix-dog-gear',
        items: [{ slug: 'backseat-hammock-cover', variantId: 'does-not-exist', quantity: 1 }],
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_variant');
  });

  it('rejects quantity above the per-line maximum (20)', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ storeId: 'fenix-dog-gear', items: [{ slug: 'backseat-hammock-cover', variantId: 'std', quantity: 21 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_body');
  });

  it('returns 400 (not 500) for malformed JSON body', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .set('Content-Type', 'application/json')
      .send('{ not valid json');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('invalid_json');
  });

  it('webhook without signature when secret set returns 400 and order not paid', async () => {
    const db = app.locals.db;
    const res = await request(app)
      .post('/api/checkout')
      .send({ storeId: 'fenix-dog-gear', slug: 'backseat-hammock-cover', quantity: 1, utm: { source: 'tiktok' } });
    const orderId2 = res.body.orderId;
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
    const wh = await request(app).post('/api/webhooks/stripe').set('Content-Type', 'application/json').send({ type: 'ping' });
    expect(wh.status).toBe(400);
    const check = await db.query('select status from orders where group_id=$1 or id=$1', [orderId2]);
    expect(check.rows[0].status).toBe('pending');
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });
});

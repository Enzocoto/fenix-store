import { randomUUID } from 'node:crypto';
import type { Db } from './db/pool';

export interface SeedProduct {
  storeSlug: string;
  slug: string;
  name: string;
  priceCents: number;
  costCents: number;
  variants?: Array<{ id: string; priceCents: number; label: string }>;
}

/**
 * Catálogo inicial. Es data, no código: para reciclar la tienda a otra temática
 * se cambian estos valores (y las fotos), no la lógica.
 */
export const productSeed: SeedProduct[] = [
  {
    storeSlug: 'fenix-dog-gear',
    slug: 'backseat-hammock-cover',
    name: 'Backseat Hammock Dog Seat Cover',
    priceCents: 3999,
    costCents: 1200,
    variants: [
      { id: 'std', priceCents: 3999, label: 'Standard' },
      { id: 'xl', priceCents: 4499, label: 'XL' },
      { id: 'std-mesh', priceCents: 4799, label: 'Standard + door protectors' },
    ],
  },
];

export const storeSeed = [
  { slug: 'fenix-dog-gear', name: 'Fenix Dog Gear', domain: 'dogs.fenix.example' },
  { slug: 'fenix-home', name: 'Fenix Home', domain: 'home.fenix.example' },
];

export async function seedProducts(db: Db): Promise<void> {
  for (const store of storeSeed) {
    await db.query(
      'insert into stores (id, slug, name, domain) values ($1, $2, $3, $4) on conflict (slug) do nothing',
      [store.slug, store.slug, store.name, store.domain],
    );
  }
  const { rows } = await db.query('select count(*) as n from products');
  if (Number(rows[0].n) > 0) return;
  for (const p of productSeed) {
    await db.query(
      'insert into products (id, store_id, slug, name, price_cents, cost_cents, variants) values ($1, $2, $3, $4, $5, $6, $7)',
      [randomUUID(), p.storeSlug, p.slug, p.name, p.priceCents, p.costCents, p.variants ? JSON.stringify(p.variants) : null],
    );
  }
}

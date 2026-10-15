import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Db } from '../db/pool';
import { normalizeSource } from '../lib/normalize';
import { stripe } from '../services/stripe';
import { env } from '../env';
import { asyncHandler } from '../lib/async-handler';

const itemSchema = z.object({
  slug: z.string().min(1).max(200),
  variantId: z.string().max(100).optional(),
  quantity: z.number().int().min(1).max(20).default(1),
});

interface VariantRow {
  id: string;
  priceCents?: number;
}

interface ProductRow {
  id: string;
  store_id: string | null;
  slug: string;
  name: string;
  price_cents: number;
  currency: string;
  variants: VariantRow[] | null;
}

const checkoutSchema = z.object({
  storeId: z.string().min(1).max(120),
  email: z.string().email().optional(),
  name: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(200).optional(),
  state: z.string().max(200).optional(),
  zip: z.string().max(50).optional(),
  referrer: z.string().max(1000).optional(),
  utm: z
    .object({
      source: z.string().max(120).optional(),
      medium: z.string().max(120).optional(),
      campaign: z.string().max(200).optional(),
      content: z.string().max(200).optional(),
      term: z.string().max(200).optional(),
    })
    .partial()
    .optional(),
  items: z.array(itemSchema).min(1).max(20).optional(),
  slug: z.string().min(1).max(200).optional(),
  quantity: z.number().int().min(1).max(20).optional(),
  variantId: z.string().max(100).optional(),
});

export function checkoutRouter(db: Db): Router {
  const router = Router();

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const parsed = checkoutSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_body', details: parsed.error.flatten() });
        return;
      }
      const d = parsed.data;

      let items: Array<{ slug: string; variantId?: string; quantity: number }> = [];
      if (d.items && d.items.length > 0) {
        items = d.items.map((i) => ({ slug: i.slug, variantId: i.variantId, quantity: i.quantity ?? 1 }));
      } else if (d.slug) {
        items = [{ slug: d.slug, variantId: d.variantId, quantity: d.quantity ?? 1 }];
      } else {
        res.status(400).json({ error: 'invalid_body' });
        return;
      }

      const groupId = randomUUID();
      const source = normalizeSource(d.utm?.source, d.referrer);
      const s = stripe();
      const provider = s ? 'stripe' : 'demo';

      const lineItems: Array<{
        product: ProductRow;
        slug: string;
        variantId?: string;
        quantity: number;
        unitPrice: number;
        amountCents: number;
      }> = [];

      for (const item of items) {
        const found = await db.query(
          'select id, store_id, slug, name, price_cents, currency, variants from products where slug = $1 and active = true and ($2::text is null or store_id = $2)',
          [item.slug, d.storeId ?? null],
        );
        const product = found.rows[0] as ProductRow | undefined;
        if (!product) {
          res.status(404).json({ error: 'product_not_found' });
          return;
        }

        let unitPrice = product.price_cents;
        if (item.variantId) {
          const variants = Array.isArray(product.variants) ? product.variants : [];
          if (variants.length > 0) {
            const match = variants.find((v) => v && v.id === item.variantId);
            if (!match) {
              // Variante inexistente: rechazamos en vez de cobrar el precio base.
              res.status(400).json({ error: 'invalid_variant', variantId: item.variantId });
              return;
            }
            if (typeof match.priceCents === 'number') {
              unitPrice = match.priceCents;
            }
          }
        }
        const amountCents = unitPrice * item.quantity;
        lineItems.push({ product, slug: item.slug, variantId: item.variantId, quantity: item.quantity, unitPrice, amountCents });
      }

      const totalAmountCents = lineItems.reduce((sum, l) => sum + l.amountCents, 0);
      const currency = lineItems[0]?.product.currency ?? 'USD';

      for (const l of lineItems) {
        await db.query(
          `insert into orders
             (id, store_id, status, email, customer_name, product_id, variant_id, quantity, amount_cents, currency, provider,
              utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, address, city, region, postal_code, group_id)
           values ($1,$2,'pending',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
          [
            randomUUID(),
            l.product.store_id ?? d.storeId ?? null,
            d.email ?? null,
            d.name ?? null,
            l.product.id,
            l.variantId ?? null,
            l.quantity,
            l.amountCents,
            l.product.currency,
            provider,
            source,
            d.utm?.medium ?? null,
            d.utm?.campaign ?? null,
            d.utm?.content ?? null,
            d.utm?.term ?? null,
            d.referrer ?? null,
            d.address ?? null,
            d.city ?? null,
            d.state ?? null,
            d.zip ?? null,
            groupId,
          ],
        );
      }

      if (s) {
        const session = await s.checkout.sessions.create({
          mode: 'payment',
          customer_email: d.email,
          line_items: lineItems.map((l) => ({
            quantity: l.quantity,
            price_data: {
              currency: l.product.currency.toLowerCase(),
              unit_amount: l.unitPrice,
              product_data: { name: l.product.name },
            },
          })),
          success_url: `${env.publicBaseUrl}/#/checkout?status=success&order=${groupId}`,
          cancel_url: `${env.publicBaseUrl}/#/cart`,
          metadata: { orderId: groupId },
        });
        await db.query('update orders set provider_ref = $1 where group_id = $2', [session.id, groupId]);
        res.json({ mode: 'live', orderId: groupId, url: session.url });
        return;
      }

      res.json({ mode: 'demo', orderId: groupId, amountCents: totalAmountCents, currency });
    }),
  );

  return router;
}

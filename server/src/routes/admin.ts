/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { Db } from '../db/pool';
import { requireAdmin, signAdminToken } from '../middleware/auth';
import { computeFinance } from '../services/finance';
import { env } from '../env';
import { asyncHandler } from '../lib/async-handler';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function adminRouter(db: Db): Router {
  const router = Router();

  router.post(
    '/login',
    asyncHandler(async (req, res) => {
      const parsed = loginSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_body' });
        return;
      }
      const { rows } = await db.query('select id, email, password_hash from admin_users where email = $1', [
        parsed.data.email,
      ]);
      const user = rows[0];
      if (!user) {
        res.status(401).json({ error: 'invalid_credentials' });
        return;
      }
      const ok = await bcrypt.compare(parsed.data.password, user.password_hash);
      if (!ok) {
        res.status(401).json({ error: 'invalid_credentials' });
        return;
      }
      res.json({ token: signAdminToken(user.email), email: user.email });
    }),
  );

  router.get(
    '/summary',
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const orders = (await db.query('select * from orders')).rows;
      const products = (await db.query('select id, cost_cents from products')).rows;
      const visits = (await db.query('select source from visits')).rows;

      const finance = computeFinance(orders, products, env.feePercent, env.feeFixedCents);
      const visitsBySource: Record<string, number> = {};
      for (const v of visits) {
        const key = v.source ?? 'unknown';
        visitsBySource[key] = (visitsBySource[key] ?? 0) + 1;
      }

      const totalOrders = new Set(orders.map((o: any) => o.group_id ?? o.id)).size;
      const paidOrders = new Set(orders.filter((o: any) => o.status === 'paid').map((o: any) => o.group_id ?? o.id)).size;

      res.json({
        finance,
        visits: visits.length,
        totalOrders,
        paidOrders,
        visitsBySource,
      });
    }),
  );

  router.get(
    '/orders',
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const { rows } = await db.query('select * from orders order by created_at desc limit 200');
      res.json({ orders: rows });
    }),
  );

  router.get(
    '/analytics',
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const bySource = (
        await db.query('select source, count(*) as visits from visits group by source order by visits desc')
      ).rows;
      const byMedium = (
        await db.query(
          'select medium, count(*) as visits from visits where medium is not null group by medium order by visits desc',
        )
      ).rows;
      const byCampaign = (
        await db.query(
          'select campaign, count(*) as visits from visits where campaign is not null group by campaign order by visits desc',
        )
      ).rows;
      const ordersBySource = (
        await db.query(
          "select utm_source as source, count(distinct coalesce(group_id, id)) as orders, coalesce(sum(amount_cents),0) as revenue_cents from orders where status='paid' group by utm_source order by revenue_cents desc",
        )
      ).rows;
      res.json({ bySource, byMedium, byCampaign, ordersBySource });
    }),
  );

  router.get(
    '/finance',
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const orders = (await db.query('select * from orders')).rows;
      const products = (await db.query('select id, cost_cents from products')).rows;
      res.json(computeFinance(orders, products, env.feePercent, env.feeFixedCents));
    }),
  );

  // Portfolio-level data belongs to the owner portal, not to one storefront.
  router.get(
    '/portfolio',
    requireAdmin,
    asyncHandler(async (_req, res) => {
      const stores = (await db.query('select id, slug, name, domain, currency, active from stores order by created_at asc')).rows;
      const products = (await db.query('select id, store_id, slug, name, price_cents, cost_cents, currency, active from products order by created_at asc')).rows;
      const orders = (await db.query('select * from orders')).rows;
      const visits = (await db.query('select store_id, product_slug, source, medium, campaign from visits')).rows;
      const finance = computeFinance(orders, products, env.feePercent, env.feeFixedCents);

      const storeMetrics = stores.map((store: any) => {
        const storeOrders = orders.filter((order: any) => order.store_id === store.id);
        const storeProducts = products.filter((product: any) => product.store_id === store.id);
        const storeVisits = visits.filter((visit: any) => visit.store_id === store.id);
        const storeFinance = computeFinance(storeOrders, storeProducts, env.feePercent, env.feeFixedCents);
        const totalOrders = new Set(storeOrders.map((o: any) => o.group_id ?? o.id)).size;
        const paidOrders = new Set(storeOrders.filter((o: any) => o.status === 'paid').map((o: any) => o.group_id ?? o.id)).size;
        return {
          ...store,
          visits: storeVisits.length,
          totalOrders,
          paidOrders,
          revenueCents: storeFinance.revenueCents,
          netProfitCents: storeFinance.netProfitCents,
          margin: storeFinance.margin,
          conversion: storeVisits.length ? paidOrders / storeVisits.length : 0,
        };
      });

      const productMetrics = products.map((product: any) => {
        const productOrders = orders.filter((order: any) => order.product_id === product.id);
        const productVisits = visits.filter(
          (visit: any) => visit.store_id === product.store_id && visit.product_slug === product.slug,
        );
        const paidRows = productOrders.filter((order: any) => order.status === 'paid');
        const revenueCents = paidRows.reduce((sum: number, order: any) => sum + Number(order.amount_cents), 0);
        // Contamos pedidos por grupo (un pedido multi-línea = 1), no por fila.
        const totalOrders = new Set(productOrders.map((o: any) => o.group_id ?? o.id)).size;
        const paidOrders = new Set(paidRows.map((o: any) => o.group_id ?? o.id)).size;
        return {
          ...product,
          storeName: stores.find((store: any) => store.id === product.store_id)?.name ?? 'Sin tienda',
          visits: productVisits.length,
          totalOrders,
          paidOrders,
          revenueCents,
          conversion: productVisits.length ? paidOrders / productVisits.length : 0,
        };
      });

      const trafficBySource = aggregateTraffic(visits, 'source');
      const trafficByCampaign = aggregateTraffic(visits, 'campaign');

      res.json({
        finance,
        visits: visits.length,
        totalOrders: new Set(orders.map((o: any) => o.group_id ?? o.id)).size,
        paidOrders: finance.paidOrders,
        stores: storeMetrics,
        products: productMetrics,
        traffic: { bySource: trafficBySource, byCampaign: trafficByCampaign },
      });
    }),
  );

  return router;
}

function aggregateTraffic(rows: any[], key: 'source' | 'campaign') {
  const grouped = new Map<string, { storeId: string | null; value: string | null; visits: number }>();
  for (const row of rows) {
    const value = row[key] ?? null;
    const storeId = row.store_id ?? null;
    const groupKey = `${storeId ?? 'all'}:${value ?? 'unknown'}`;
    const current = grouped.get(groupKey);
    if (current) current.visits += 1;
    else grouped.set(groupKey, { storeId, value, visits: 1 });
  }
  return [...grouped.values()]
    .sort((a, b) => b.visits - a.visits)
    .map((row) => ({ storeId: row.storeId, [key]: row.value, visits: row.visits }));
}

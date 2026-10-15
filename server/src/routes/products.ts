import { Router } from 'express';
import type { Db } from '../db/pool';
import { asyncHandler } from '../lib/async-handler';

export function productsRouter(db: Db): Router {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const storeId = typeof req.query.storeId === 'string' ? req.query.storeId : '';
      const result = storeId
        ? await db.query(
            'select id, store_id, slug, name, price_cents, currency, variants from products where active = true and store_id = $1 order by created_at asc',
            [storeId],
          )
        : await db.query(
            'select id, store_id, slug, name, price_cents, currency, variants from products where active = true order by created_at asc',
          );
      const { rows } = result;
      res.json({ products: rows });
    }),
  );

  return router;
}

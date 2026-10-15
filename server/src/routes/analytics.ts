import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { Db } from '../db/pool';
import { normalizeSource } from '../lib/normalize';
import { asyncHandler } from '../lib/async-handler';

const trackSchema = z.object({
  path: z.string().max(500).optional(),
  referrer: z.string().max(1000).optional(),
  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  campaign: z.string().max(200).optional(),
  content: z.string().max(200).optional(),
  term: z.string().max(200).optional(),
  sessionId: z.string().max(120).optional(),
  storeId: z.string().max(120).optional(),
  productSlug: z.string().max(200).optional(),
});

export function trackRouter(db: Db): Router {
  const router = Router();

  router.post(
    '/',
    asyncHandler(async (req, res) => {
      const parsed = trackSchema.safeParse(req.body ?? {});
      if (!parsed.success) {
        res.status(400).json({ error: 'invalid_body' });
        return;
      }
      const d = parsed.data;
      const source = normalizeSource(d.source, d.referrer);
      await db.query(
        `insert into visits (id, store_id, product_slug, path, referrer, source, medium, campaign, content, term, session_id)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          randomUUID(),
          d.storeId ?? null,
          d.productSlug ?? null,
          d.path ?? null,
          d.referrer ?? null,
          source,
          d.medium ?? null,
          d.campaign ?? null,
          d.content ?? null,
          d.term ?? null,
          d.sessionId ?? null,
        ],
      );
      res.status(204).end();
    }),
  );

  return router;
}

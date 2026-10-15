import express from 'express';
import cors from 'cors';
import type { Db } from './db/pool';
import { productsRouter } from './routes/products';
import { trackRouter } from './routes/analytics';
import { checkoutRouter } from './routes/checkout';
import { adminRouter } from './routes/admin';
import { stripeWebhookHandler } from './routes/webhooks';
import { env, isStripeEnabled } from './env';

export function createApp(db: Db) {
  const app = express();
  const origins = Array.from(new Set(env.corsOrigins));
  app.use(cors({ origin: origins.length > 0 ? origins : true }));

  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler(db));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/config', (_req, res) => {
    res.json({
      brand: 'Fenix',
      currency: 'USD',
      stripeEnabled: isStripeEnabled(),
      provider: env.supplierProvider,
    });
  });

  app.use('/api/products', productsRouter(db));
  app.use('/api/track', trackRouter(db));
  app.use('/api/checkout', checkoutRouter(db));
  app.use('/api/admin', adminRouter(db));

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // JSON malformado en el body → 400, no 500.
    if (err?.type === 'entity.parse.failed' || err instanceof SyntaxError) {
      res.status(400).json({ error: 'invalid_json' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  });

  app.locals.db = db;
  return app;
}

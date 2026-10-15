/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from 'express';
import type { Db } from '../db/pool';
import { stripe } from '../services/stripe';
import { env } from '../env';
import { asyncHandler } from '../lib/async-handler';

export function stripeWebhookHandler(db: Db) {
  return asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const s = stripe();
    if (!s) {
      res.status(503).json({ error: 'stripe_disabled' });
      return;
    }

    const signature = req.headers['stripe-signature'] as string | undefined;
    if (!env.stripeWebhookSecret) {
      res.status(400).json({ error: 'webhook_secret_missing' });
      return;
    }
    if (!signature) {
      res.status(400).json({ error: 'invalid_signature' });
      return;
    }
    let event: any;
    try {
      event = s.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
    } catch {
      res.status(400).json({ error: 'invalid_signature' });
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const orderId = event.data?.object?.metadata?.orderId;
      if (orderId) {
        await db.query("update orders set status='paid', paid_at=now() where group_id=$1 or id=$1", [orderId]);
      }
    }

    res.json({ received: true });
  });
}

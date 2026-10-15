import Stripe from 'stripe';
import { env, isStripeEnabled } from '../env';

let client: Stripe | null = null;

export function stripe(): Stripe | null {
  if (!isStripeEnabled()) return null;
  if (!client) client = new Stripe(env.stripeSecret);
  return client;
}

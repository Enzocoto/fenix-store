import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 3000),
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
  adminEmail: process.env.ADMIN_EMAIL ?? '',
  adminPassword: process.env.ADMIN_PASSWORD ?? '',
  // Getters: se leen en cada acceso para que los tests puedan activar/desactivar
  // Stripe en caliente sin recargar el módulo.
  get stripeSecret() {
    return process.env.STRIPE_SECRET_KEY ?? '';
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET ?? '';
  },
  supplierProvider: (process.env.SUPPLIER_PROVIDER ?? 'none') as 'none' | 'cjdropshipping' | 'zendrop',
  supplierApiKey: process.env.SUPPLIER_API_KEY ?? '',
  feePercent: Number(process.env.FEE_PERCENT ?? 2.9),
  feeFixedCents: Number(process.env.FEE_FIXED_CENTS ?? 30),
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .concat(process.env.PUBLIC_BASE_URL ? [process.env.PUBLIC_BASE_URL] : [])
    .concat('http://localhost:5173'),
};

export function isStripeEnabled(): boolean {
  return Boolean(env.stripeSecret);
}

/**
 * Aborta el arranque en producción si faltan secretos críticos. Evita desplegar
 * con el JWT_SECRET por defecto (que permitiría forjar tokens de admin).
 */
export function assertProductionSecrets(): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'dev-secret-change-me') {
    throw new Error('JWT_SECRET must be set to a strong, unique value in production.');
  }
}

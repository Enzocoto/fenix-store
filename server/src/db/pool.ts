/* eslint-disable @typescript-eslint/no-explicit-any */
import pg from 'pg';
import { newDb } from 'pg-mem';
import { env } from '../env';

export interface Db {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }>;
}

/**
 * Real PostgreSQL when DATABASE_URL is set (production / Render).
 * Otherwise an in-memory Postgres (pg-mem) so the app runs with zero setup.
 */
export function createPool(): Db {
  if (env.databaseUrl) {
    const pool = new pg.Pool({
      connectionString: env.databaseUrl,
      ssl: env.databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
    });
    return pool as unknown as Db;
  }
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  return new Pool() as unknown as Db;
}

import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { Db } from './pool';
import { env } from '../env';
import { seedProducts } from '../seed';

export async function bootstrap(db: Db): Promise<void> {
  const schemaUrl = new URL('./schema.sql', import.meta.url);
  const sql = await readFile(schemaUrl, 'utf8');
  for (const statement of sql.split(';').map((s) => s.trim()).filter(Boolean)) {
    await db.query(statement);
  }
  await seedProducts(db);
  if (env.adminEmail && env.adminPassword) {
    await ensureAdmin(db, env.adminEmail, env.adminPassword);
  }
}

export async function ensureAdmin(db: Db, email: string, password: string): Promise<void> {
  const existing = await db.query('select id from admin_users where email = $1', [email]);
  if (existing.rows.length > 0) return;
  const passwordHash = await bcrypt.hash(password, 10);
  await db.query('insert into admin_users (id, email, password_hash) values ($1, $2, $3)', [
    randomUUID(),
    email,
    passwordHash,
  ]);
}

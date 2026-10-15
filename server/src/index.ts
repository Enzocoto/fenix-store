import { createPool } from './db/pool';
import { bootstrap } from './db/init';
import { createApp } from './app';
import { env, assertProductionSecrets } from './env';

assertProductionSecrets();

const db = createPool();
await bootstrap(db);

const app = createApp(db);
app.listen(env.port, () => {
  const dbMode = env.databaseUrl ? 'postgres' : 'memory (pg-mem)';
  console.log(`Fenix API on http://localhost:${env.port} — db: ${dbMode}, stripe: ${env.stripeSecret ? 'on' : 'off'}`);
});

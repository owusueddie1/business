import { Pool, QueryResultRow } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Missing required environment variable: DATABASE_URL');
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

declare global {
  // eslint-disable-next-line no-var
  var __neonPool__: Pool | undefined;
}

if (process.env.NODE_ENV !== 'production') {
  global.__neonPool__ = global.__neonPool__ || pool;
}

export const db = process.env.NODE_ENV === 'production' ? pool : global.__neonPool__ || pool;

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return db.query<T>(text, params);
}

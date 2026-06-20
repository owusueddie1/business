import { Pool, QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __neonPool__: Pool | undefined;
}

const getPool = () => {
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

  if (process.env.NODE_ENV !== 'production') {
    global.__neonPool__ = global.__neonPool__ || pool;
  }

  return process.env.NODE_ENV === 'production' ? pool : global.__neonPool__ || pool;
};

const db = (() => {
  try {
    return getPool();
  } catch (error) {
    return undefined;
  }
})();

export const getDb = () => {
  if (!db) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }
  return db;
};

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return getDb().query<T>(text, params);
}

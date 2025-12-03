import { drizzle } from 'drizzle-orm/neon-http';
import { neon, Pool } from '@neondatabase/serverless';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

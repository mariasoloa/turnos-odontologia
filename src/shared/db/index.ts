import pg from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.ts';

export type Db = NodePgDatabase<typeof schema>;
/** Transacción de Drizzle, tal como la recibe la función de withTenant. */
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];

export interface Conexion {
  db: Db;
  cerrar(): Promise<void>;
}

/** Crea un pool de conexiones y su cliente Drizzle. La aplicación usa el rol sin BYPASSRLS. */
export function crearConexion(url: string, opciones: { max?: number } = {}): Conexion {
  const pool = new pg.Pool({ connectionString: url, max: opciones.max ?? 10 });
  return {
    db: drizzle(pool, { schema }),
    cerrar: () => pool.end(),
  };
}

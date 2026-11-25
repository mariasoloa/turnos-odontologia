import { sql } from 'drizzle-orm';
import { z } from 'zod';
import type { Db, Tx } from './index.ts';

const idConsultorio = z.string().uuid();

/**
 * Ejecuta `fn` dentro de una transacción acotada a un consultorio (RN-SE-03).
 * Fija `app.tenant_id` con `set_config(..., true)`: el valor vale solo para esta transacción,
 * así que la conexión vuelve al pool sin consultorio fijado. Las políticas RLS filtran por ese valor.
 */
export async function withTenant<T>(db: Db, tenantId: string, fn: (tx: Tx) => Promise<T>): Promise<T> {
  if (!idConsultorio.safeParse(tenantId).success) {
    throw new Error('Identificador de consultorio inválido');
  }
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.tenant_id', ${tenantId}, true)`);
    return fn(tx);
  });
}

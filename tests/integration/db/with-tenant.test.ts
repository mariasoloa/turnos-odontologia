import { afterAll, describe, expect, it } from 'vitest';
import { sql } from 'drizzle-orm';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { withTenant } from '../../../src/shared/db/with-tenant.ts';
import { urlTestAplicacion } from '../entorno.ts';

const conexion = crearConexion(urlTestAplicacion(), { max: 1 });

afterAll(async () => {
  await conexion.cerrar();
});

async function tenantActual(): Promise<string> {
  const { rows } = await conexion.db.execute<{ valor: string | null }>(
    sql`select current_setting('app.tenant_id', true) as valor`,
  );
  return rows[0]?.valor ?? '';
}

describe('withTenant', () => {
  it('fija app.tenant_id dentro de la transacción', async () => {
    const tenantId = crypto.randomUUID();
    const visto = await withTenant(conexion.db, tenantId, async (tx) => {
      const { rows } = await tx.execute<{ valor: string }>(sql`select current_setting('app.tenant_id') as valor`);
      return rows[0]?.valor;
    });
    expect(visto).toBe(tenantId);
  });

  it('no deja app.tenant_id fijado al terminar, ni siquiera en la misma conexión', async () => {
    await withTenant(conexion.db, crypto.randomUUID(), async () => undefined);
    expect(await tenantActual()).toBe('');
  });

  it('revierte la transacción y no deja el consultorio fijado si la función falla', async () => {
    await expect(
      withTenant(conexion.db, crypto.randomUUID(), async () => {
        throw new Error('falla a propósito');
      }),
    ).rejects.toThrow('falla a propósito');
    expect(await tenantActual()).toBe('');
  });

  it('rechaza un identificador de consultorio que no es un UUID', async () => {
    await expect(withTenant(conexion.db, 'no-es-uuid', async () => undefined)).rejects.toThrow(
      'Identificador de consultorio inválido',
    );
  });
});

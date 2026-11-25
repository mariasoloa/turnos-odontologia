import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import pg from 'pg';
import { urlTestAplicacion, urlTestMigraciones } from '../entorno.ts';

const TABLAS_DE_CONSULTORIO = ['paciente', 'prestacion', 'prestacion_profesional', 'profesional', 'sillon', 'turno'];

const admin = new pg.Pool({ connectionString: urlTestMigraciones(), max: 1 });
const app = new pg.Pool({ connectionString: urlTestAplicacion(), max: 2 });

let consultorioA = '';
let consultorioB = '';

beforeAll(async () => {
  const sufijo = crypto.randomUUID().slice(0, 8);
  const insertar = async (slug: string): Promise<string> => {
    const { rows } = await admin.query<{ id: string }>(
      "insert into consultorio (nombre, slug) values ('Consultorio de prueba', $1) returning id",
      [`${slug}-${sufijo}`],
    );
    const fila = rows[0];
    if (!fila) throw new Error('No se pudo crear el consultorio de prueba');
    return fila.id;
  };
  consultorioA = await insertar('rls-a');
  consultorioB = await insertar('rls-b');
  await admin.query("insert into sillon (tenant_id, nombre) values ($1, 'Box A'), ($2, 'Box B')", [
    consultorioA,
    consultorioB,
  ]);
});

afterAll(async () => {
  await Promise.all([admin.end(), app.end()]);
});

async function comoConsultorio<T>(tenantId: string | null, fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const cliente = await app.connect();
  try {
    await cliente.query('begin');
    if (tenantId) await cliente.query("select set_config('app.tenant_id', $1, true)", [tenantId]);
    const resultado = await fn(cliente);
    await cliente.query('commit');
    return resultado;
  } catch (error) {
    await cliente.query('rollback');
    throw error;
  } finally {
    cliente.release();
  }
}

describe('row level security', () => {
  it('está activada y forzada en todas las tablas de consultorio y en consultorio', async () => {
    const { rows } = await admin.query<{ relname: string; relrowsecurity: boolean; relforcerowsecurity: boolean }>(
      `select relname, relrowsecurity, relforcerowsecurity from pg_class
        where relname = any($1) order by relname`,
      [[...TABLAS_DE_CONSULTORIO, 'consultorio']],
    );
    expect(rows).toHaveLength(TABLAS_DE_CONSULTORIO.length + 1);
    for (const fila of rows) {
      expect({ tabla: fila.relname, rls: fila.relrowsecurity, forzada: fila.relforcerowsecurity }).toEqual({
        tabla: fila.relname,
        rls: true,
        forzada: true,
      });
    }
  });

  it('el rol de la aplicación no es superusuario ni tiene BYPASSRLS', async () => {
    const { rows } = await app.query<{ rolsuper: boolean; rolbypassrls: boolean }>(
      'select rolsuper, rolbypassrls from pg_roles where rolname = current_user',
    );
    expect(rows[0]).toEqual({ rolsuper: false, rolbypassrls: false });
  });

  it('sin consultorio fijado, la aplicación no ve filas', async () => {
    const sillones = await comoConsultorio(null, (c) => c.query('select id from sillon'));
    const consultorios = await comoConsultorio(null, (c) => c.query('select id from consultorio'));
    expect(sillones.rowCount).toBe(0);
    expect(consultorios.rowCount).toBe(0);
  });

  it('con un consultorio fijado, la aplicación ve solo sus filas', async () => {
    const sillones = await comoConsultorio(consultorioA, (c) =>
      c.query<{ tenant_id: string }>('select tenant_id from sillon'),
    );
    const consultorios = await comoConsultorio(consultorioA, (c) =>
      c.query<{ id: string }>('select id from consultorio'),
    );
    expect(sillones.rows.map((r) => r.tenant_id)).toEqual([consultorioA]);
    expect(consultorios.rows.map((r) => r.id)).toEqual([consultorioA]);
  });

  it('la aplicación no puede insertar filas de otro consultorio', async () => {
    await expect(
      comoConsultorio(consultorioA, (c) =>
        c.query("insert into sillon (tenant_id, nombre) values ($1, 'Intruso')", [consultorioB]),
      ),
    ).rejects.toMatchObject({ code: '42501' });
  });

  it('la aplicación no puede borrar filas', async () => {
    await expect(
      comoConsultorio(consultorioA, (c) => c.query('delete from sillon')),
    ).rejects.toMatchObject({ code: '42501' });
  });
});

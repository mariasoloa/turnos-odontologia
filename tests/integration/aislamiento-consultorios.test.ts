import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq, sql } from 'drizzle-orm';
import { crearConexion } from '../../src/shared/db/index.ts';
import { turno } from '../../src/shared/db/schema.ts';
import { withTenant } from '../../src/shared/db/with-tenant.ts';
import type { ConsultorioDemo } from '../../db/datos-demo.ts';
import { crearFixtures } from './fixtures.ts';
import { urlTestAplicacion, urlTestMigraciones } from './entorno.ts';

// Spec: aislamiento-consultorios. Verifica el aislamiento en la base de datos, sin pasar por los casos de uso.

const fixtures = crearFixtures();
const admin = crearConexion(urlTestMigraciones(), { max: 1 });
const app = crearConexion(urlTestAplicacion(), { max: 2 });

let a: ConsultorioDemo;
let b: ConsultorioDemo;
let turnoDeB = '';

const rango = { inicio: new Date('2026-12-01T13:00:00Z'), fin: new Date('2026-12-01T13:30:00Z') };

beforeAll(async () => {
  [a, b] = await Promise.all([fixtures.consultorio(), fixtures.consultorio()]);
  const nuevoTurno = (c: ConsultorioDemo) => ({
    tenantId: c.id,
    pacienteId: c.pacientes.principal,
    profesionalId: c.profesionales.ana,
    sillonId: c.sillones.box1,
    prestacionId: c.prestaciones.limpieza,
    rango,
    origen: 'personal' as const,
  });
  await admin.db.insert(turno).values(nuevoTurno(a));
  const [creado] = await admin.db.insert(turno).values(nuevoTurno(b)).returning({ id: turno.id });
  turnoDeB = creado?.id ?? '';
});

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), admin.cerrar(), app.cerrar()]);
});

describe('aislamiento entre consultorios en la base de datos', () => {
  it('listar turnos sin filtro devuelve solo los del consultorio propio', async () => {
    const filas = await withTenant(app.db, a.id, (tx) => tx.select({ tenantId: turno.tenantId }).from(turno));
    expect(filas).toEqual([{ tenantId: a.id }]);
  });

  it('modificar un turno de otro consultorio no lo encuentra y no lo cambia', async () => {
    const actualizados = await withTenant(app.db, a.id, (tx) =>
      tx
        .update(turno)
        .set({ estado: 'cancelado', canceladoEn: new Date(), canceladoPor: 'personal' })
        .where(eq(turno.id, turnoDeB))
        .returning({ id: turno.id }),
    );
    expect(actualizados).toEqual([]);
    const [original] = await admin.db.select({ estado: turno.estado }).from(turno).where(eq(turno.id, turnoDeB));
    expect(original?.estado).toBe('reservado');
  });

  it('la base rechaza un turno con un profesional de otro consultorio (clave foránea compuesta)', async () => {
    await expect(
      withTenant(app.db, a.id, (tx) =>
        tx.insert(turno).values({
          tenantId: a.id,
          pacienteId: a.pacientes.principal,
          profesionalId: b.profesionales.ana,
          prestacionId: a.prestaciones.consultaBreve,
          rango,
          origen: 'personal',
        }),
      ),
    ).rejects.toSatisfy((error: unknown) => codigoPostgres(error) === '23503');
  });

  it('sin consultorio fijado no se ve ningún turno', async () => {
    const { rows } = await app.db.execute(sql`select id from turno`);
    expect(rows).toEqual([]);
  });
});

/** Drizzle envuelve los errores del driver; el código SQLSTATE queda en `cause`. */
function codigoPostgres(error: unknown): string | undefined {
  let actual: unknown = error;
  while (actual instanceof Error) {
    if ('code' in actual && typeof actual.code === 'string') return actual.code;
    actual = actual.cause;
  }
  return undefined;
}

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { turno } from '../../../src/shared/db/schema.ts';
import { withTenant } from '../../../src/shared/db/with-tenant.ts';
import type { ConsultorioDemo } from '../../../db/datos-demo.ts';
import { crearFixtures } from '../fixtures.ts';
import { urlTestAplicacion } from '../entorno.ts';

// Restricciones EXCLUDE (design D1) probadas directamente con INSERT, sin los casos de uso.

const fixtures = crearFixtures();
const app = crearConexion(urlTestAplicacion(), { max: 2 });
let c: ConsultorioDemo;

beforeAll(async () => {
  c = await fixtures.consultorio();
});

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), app.cerrar()]);
});

const hora = (hhmm: string): Date => new Date(`2026-12-01T${hhmm}:00Z`);

function insertar(datos: {
  profesional: string;
  sillon: string | null;
  desde: string;
  hasta: string;
  estado?: 'reservado' | 'cancelado';
}) {
  const cancelado = datos.estado === 'cancelado';
  return withTenant(app.db, c.id, (tx) =>
    tx.insert(turno).values({
      tenantId: c.id,
      pacienteId: c.pacientes.principal,
      profesionalId: datos.profesional,
      sillonId: datos.sillon,
      prestacionId: c.prestaciones.limpieza,
      rango: { inicio: hora(datos.desde), fin: hora(datos.hasta) },
      origen: 'personal',
      estado: datos.estado ?? 'reservado',
      ...(cancelado ? { canceladoEn: new Date(), canceladoPor: 'personal' as const } : {}),
    }),
  );
}

function errorPostgres(error: unknown): { code?: string; constraint?: string } {
  let actual: unknown = error;
  while (actual instanceof Error) {
    if ('code' in actual) return actual as { code?: string; constraint?: string };
    actual = actual.cause;
  }
  return {};
}

async function esperarExclusion(promesa: Promise<unknown>, restriccion: string): Promise<void> {
  const error = await promesa.then(
    () => undefined,
    (e: unknown) => e,
  );
  expect(errorPostgres(error)).toMatchObject({ code: '23P01', constraint: restriccion });
}

describe('restricciones de exclusión sobre turno', () => {
  it('rechazan dos turnos superpuestos del mismo profesional', async () => {
    await insertar({ profesional: c.profesionales.ana, sillon: c.sillones.box1, desde: '10:00', hasta: '10:30' });
    await esperarExclusion(
      insertar({ profesional: c.profesionales.ana, sillon: c.sillones.box2, desde: '10:15', hasta: '10:45' }),
      'turno_sin_solapamiento_profesional',
    );
  });

  it('rechazan dos turnos superpuestos en el mismo sillón con profesionales distintos', async () => {
    await insertar({ profesional: c.profesionales.ana, sillon: c.sillones.box1, desde: '12:00', hasta: '12:30' });
    await esperarExclusion(
      insertar({ profesional: c.profesionales.luis, sillon: c.sillones.box1, desde: '12:15', hasta: '13:15' }),
      'turno_sin_solapamiento_sillon',
    );
  });

  it('permiten turnos contiguos del mismo profesional y sillón', async () => {
    await insertar({ profesional: c.profesionales.luis, sillon: c.sillones.box2, desde: '14:00', hasta: '14:30' });
    await expect(
      insertar({ profesional: c.profesionales.luis, sillon: c.sillones.box2, desde: '14:30', hasta: '15:00' }),
    ).resolves.toBeDefined();
  });

  it('permiten turnos sin sillón superpuestos de profesionales distintos', async () => {
    await insertar({ profesional: c.profesionales.ana, sillon: null, desde: '16:00', hasta: '16:15' });
    await expect(
      insertar({ profesional: c.profesionales.luis, sillon: null, desde: '16:00', hasta: '16:15' }),
    ).resolves.toBeDefined();
  });

  it('ignoran los turnos cancelados', async () => {
    await insertar({
      profesional: c.profesionales.ana,
      sillon: c.sillones.box2,
      desde: '18:00',
      hasta: '18:30',
      estado: 'cancelado',
    });
    await expect(
      insertar({ profesional: c.profesionales.ana, sillon: c.sillones.box2, desde: '18:00', hasta: '18:30' }),
    ).resolves.toBeDefined();
  });
});

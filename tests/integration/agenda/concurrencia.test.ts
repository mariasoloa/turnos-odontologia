import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import pg from 'pg';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { crearTurno } from '../../../src/features/agenda/application/crear-turno.ts';
import { crearUnidadDeTrabajo } from '../../../src/features/agenda/infrastructure/repositorio-agenda.drizzle.ts';
import type { ConsultorioDemo } from '../../../db/datos-demo.ts';
import { crearFixtures } from '../fixtures.ts';
import { urlTestAplicacion } from '../entorno.ts';

// Spec: turnos, "Garantía ante operaciones simultáneas" (RN-RE-06, design D9).
// Dos pools distintos, de una conexión cada uno: las dos operaciones corren de verdad en paralelo.

const REPETICIONES = 20;

const fixtures = crearFixtures();
const conexionA = crearConexion(urlTestAplicacion(), { max: 1 });
const conexionB = crearConexion(urlTestAplicacion(), { max: 1 });
const uowA = crearUnidadDeTrabajo(conexionA.db);
const uowB = crearUnidadDeTrabajo(conexionB.db);

let c: ConsultorioDemo;

beforeAll(async () => {
  c = await fixtures.consultorio();
});

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), conexionA.cerrar(), conexionB.cerrar()]);
});

/** Un día distinto por repetición y por escenario, para que no interfieran entre sí. */
const inicioLocal = (mes: '01' | '02', repeticion: number): string =>
  `2027-${mes}-${String(repeticion + 1).padStart(2, '0')}T10:00`;

async function enParalelo(a: unknown, b: unknown) {
  const resultados = await Promise.allSettled([crearTurno({ uow: uowA }, a), crearTurno({ uow: uowB }, b)]);
  return resultados.map((r) => {
    if (r.status === 'rejected') throw r.reason;
    return r.value;
  });
}

describe('creaciones simultáneas', () => {
  it(`mismo profesional: exactamente un éxito y un ProfesionalOcupado en ${REPETICIONES} repeticiones`, async () => {
    for (let i = 0; i < REPETICIONES; i++) {
      const base = {
        consultorioId: c.id,
        pacienteId: c.pacientes.principal,
        profesionalId: c.profesionales.ana,
        prestacionId: c.prestaciones.limpieza,
        inicioLocal: inicioLocal('01', i),
      };
      const resultados = await enParalelo({ ...base, sillonId: c.sillones.box1 }, { ...base, sillonId: c.sillones.box2 });
      expect(resultados.filter((r) => r.ok), `repetición ${i}`).toHaveLength(1);
      expect(resultados.filter((r) => !r.ok).map((r) => !r.ok && r.error), `repetición ${i}`).toEqual([
        { tipo: 'ProfesionalOcupado' },
      ]);
    }
  });

  it(`mismo sillón: exactamente un éxito y un SillonOcupado en ${REPETICIONES} repeticiones`, async () => {
    for (let i = 0; i < REPETICIONES; i++) {
      const base = { consultorioId: c.id, sillonId: c.sillones.box1, inicioLocal: inicioLocal('02', i) };
      const resultados = await enParalelo(
        { ...base, pacienteId: c.pacientes.principal, profesionalId: c.profesionales.ana, prestacionId: c.prestaciones.limpieza },
        { ...base, pacienteId: c.pacientes.secundario, profesionalId: c.profesionales.luis, prestacionId: c.prestaciones.extraccion },
      );
      expect(resultados.filter((r) => r.ok), `repetición ${i}`).toHaveLength(1);
      expect(resultados.filter((r) => !r.ok).map((r) => !r.ok && r.error), `repetición ${i}`).toEqual([
        { tipo: 'SillonOcupado' },
      ]);
    }
  });
});

describe('bloqueo entre transacciones (determinístico)', () => {
  it('la segunda inserción espera a la primera y falla con 23P01 cuando la primera confirma', async () => {
    const a = new pg.Client({ connectionString: urlTestAplicacion() });
    const b = new pg.Client({ connectionString: urlTestAplicacion() });
    await Promise.all([a.connect(), b.connect()]);
    const insertar = `insert into turno (tenant_id, paciente_id, profesional_id, sillon_id, prestacion_id, rango, origen)
      values ($1, $2, $3, $4, $5, '[2027-03-01T13:00Z,2027-03-01T13:30Z)', 'personal')`;
    try {
      for (const cliente of [a, b]) {
        await cliente.query('begin');
        await cliente.query("select set_config('app.tenant_id', $1, true)", [c.id]);
      }
      await a.query(insertar, [c.id, c.pacientes.principal, c.profesionales.ana, c.sillones.box1, c.prestaciones.limpieza]);

      // B choca con una fila todavía sin confirmar: PostgreSQL lo hace esperar en vez de decidir.
      const intentoB = b
        .query(insertar, [c.id, c.pacientes.secundario, c.profesionales.ana, c.sillones.box2, c.prestaciones.limpieza])
        .then(
          () => ({ estado: 'insertado' as const }),
          (error: { code?: string; constraint?: string }) => ({ estado: 'error' as const, code: error.code, constraint: error.constraint }),
        );
      const esperando = await Promise.race([
        intentoB.then(() => false),
        new Promise<boolean>((resolver) => setTimeout(() => resolver(true), 300)),
      ]);
      expect(esperando).toBe(true);

      await a.query('commit');
      expect(await intentoB).toEqual({ estado: 'error', code: '23P01', constraint: 'turno_sin_solapamiento_profesional' });
    } finally {
      await b.query('rollback').catch(() => undefined);
      await a.query('rollback').catch(() => undefined);
      await Promise.all([a.end(), b.end()]);
    }
  });
});

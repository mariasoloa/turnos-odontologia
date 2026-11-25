import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { crearUnidadDeTrabajo } from '../../../src/features/agenda/infrastructure/repositorio-agenda.drizzle.ts';
import type { NuevoTurno } from '../../../src/features/agenda/application/puertos.ts';
import type { ConsultorioDemo } from '../../../db/datos-demo.ts';
import { crearFixtures } from '../fixtures.ts';
import { urlTestAplicacion } from '../entorno.ts';

const fixtures = crearFixtures();
const app = crearConexion(urlTestAplicacion(), { max: 2 });
const uow = crearUnidadDeTrabajo(app.db);
let c: ConsultorioDemo;

beforeAll(async () => {
  c = await fixtures.consultorio();
});

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), app.cerrar()]);
});

const hora = (hhmm: string): Date => new Date(`2026-12-02T${hhmm}:00Z`);

function nuevo(cambios: Partial<NuevoTurno>): NuevoTurno {
  return {
    pacienteId: c.pacientes.principal,
    profesionalId: c.profesionales.ana,
    sillonId: c.sillones.box1,
    prestacionId: c.prestaciones.limpieza,
    rango: { inicio: hora('10:00'), fin: hora('10:30') },
    ...cambios,
  };
}

describe('repositorio de agenda (Drizzle)', () => {
  it('inserta un turno reservado con origen personal y devuelve su rango', async () => {
    const resultado = await uow.enConsultorio(c.id, (repo) => repo.insertarTurno(nuevo({})));
    expect(resultado).toMatchObject({
      ok: true,
      valor: { estado: 'reservado', origen: 'personal', inicio: hora('10:00'), fin: hora('10:30'), sillonId: c.sillones.box1 },
    });
  });

  it('traduce el choque de profesional a ProfesionalOcupado', async () => {
    const resultado = await uow.enConsultorio(c.id, (repo) =>
      repo.insertarTurno(nuevo({ sillonId: c.sillones.box2, rango: { inicio: hora('10:15'), fin: hora('10:45') } })),
    );
    expect(resultado).toEqual({ ok: false, error: { tipo: 'ProfesionalOcupado' } });
  });

  it('traduce el choque de sillón a SillonOcupado', async () => {
    const resultado = await uow.enConsultorio(c.id, (repo) =>
      repo.insertarTurno(
        nuevo({ profesionalId: c.profesionales.luis, prestacionId: c.prestaciones.extraccion, rango: { inicio: hora('10:15'), fin: hora('11:00') } }),
      ),
    );
    expect(resultado).toEqual({ ok: false, error: { tipo: 'SillonOcupado' } });
  });

  it('después de un choque la transacción sigue usable', async () => {
    const resultado = await uow.enConsultorio(c.id, async (repo) => {
      await repo.insertarTurno(nuevo({ rango: { inicio: hora('10:00'), fin: hora('10:30') } }));
      return repo.insertarTurno(nuevo({ rango: { inicio: hora('11:00'), fin: hora('11:30') } }));
    });
    expect(resultado.ok).toBe(true);
  });

  it('propaga cualquier otro error de la base sin traducirlo', async () => {
    await expect(
      uow.enConsultorio(c.id, (repo) => repo.insertarTurno(nuevo({ pacienteId: crypto.randomUUID(), rango: { inicio: hora('15:00'), fin: hora('15:30') } }))),
    ).rejects.toThrow();
  });
});

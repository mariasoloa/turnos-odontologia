import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { profesional, turno } from '../../../src/shared/db/schema.ts';
import { crearTurno } from '../../../src/features/agenda/application/crear-turno.ts';
import { crearUnidadDeTrabajo } from '../../../src/features/agenda/infrastructure/repositorio-agenda.drizzle.ts';
import type { ConsultorioDemo } from '../../../db/datos-demo.ts';
import { crearFixtures } from '../fixtures.ts';
import { urlTestAplicacion, urlTestMigraciones } from '../entorno.ts';

// Spec: turnos (crear). Horas locales de Buenos Aires (UTC-3): 10:00 local = 13:00 UTC.

const fixtures = crearFixtures();
const admin = crearConexion(urlTestMigraciones(), { max: 1 });
const app = crearConexion(urlTestAplicacion(), { max: 4 });
const uow = crearUnidadDeTrabajo(app.db);

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), admin.cerrar(), app.cerrar()]);
});

const DIA = '2026-12-10';
const utc = (hhmm: string): Date => new Date(`${DIA}T${hhmm}:00Z`);

function entrada(
  c: ConsultorioDemo,
  cambios: Partial<{ pacienteId: string; profesionalId: string; prestacionId: string; sillonId: string | null; inicioLocal: string }> = {},
) {
  return {
    consultorioId: c.id,
    pacienteId: c.pacientes.principal,
    profesionalId: c.profesionales.ana,
    prestacionId: c.prestaciones.limpieza,
    sillonId: c.sillones.box1,
    inicioLocal: `${DIA}T10:00`,
    ...cambios,
  };
}

const crear = (e: unknown) => crearTurno({ uow }, e);

describe('crearTurno', () => {
  it('crea un turno reservado, de origen personal, de 10:00 a 10:30 (13:00 a 13:30 UTC)', async () => {
    const c = await fixtures.consultorio();
    const resultado = await crear(entrada(c));
    expect(resultado).toMatchObject({
      ok: true,
      valor: { estado: 'reservado', origen: 'personal', inicio: utc('13:00'), fin: utc('13:30'), sillonId: c.sillones.box1 },
    });
    // Spec aislamiento-consultorios, "Operación con consultorio": el turno queda asociado al consultorio.
    const [guardado] = await admin.db
      .select({ tenantId: turno.tenantId })
      .from(turno)
      .where(eq(turno.id, resultado.ok ? resultado.valor.id : ''));
    expect(guardado?.tenantId).toBe(c.id);
  });

  it('calcula el fin con la duración de la prestación: 9:00 + 45 minutos = 9:45', async () => {
    const c = await fixtures.consultorio();
    const resultado = await crear(entrada(c, { prestacionId: c.prestaciones.extraccion, inicioLocal: `${DIA}T09:00` }));
    expect(resultado.ok && resultado.valor.fin).toEqual(utc('12:45'));
  });

  it('rechaza la falta del sillón requerido y no crea el turno', async () => {
    const c = await fixtures.consultorio();
    expect(await crear(entrada(c, { sillonId: null }))).toEqual({ ok: false, error: { tipo: 'SillonRequerido' } });
    // El mismo horario queda libre: no se creó nada.
    expect((await crear(entrada(c))).ok).toBe(true);
  });

  it('crea sin sillón una consulta breve, que ocupa solo al profesional', async () => {
    const c = await fixtures.consultorio();
    const consulta = await crear(entrada(c, { prestacionId: c.prestaciones.consultaBreve, sillonId: null }));
    expect(consulta).toMatchObject({ ok: true, valor: { sillonId: null, fin: utc('13:15') } });
    // Otro profesional puede usar cualquier sillón en ese horario.
    expect((await crear(entrada(c, { profesionalId: c.profesionales.luis, prestacionId: c.prestaciones.extraccion }))).ok).toBe(true);
  });

  it('un sillón indicado en una consulta breve queda ocupado', async () => {
    const c = await fixtures.consultorio();
    expect((await crear(entrada(c, { prestacionId: c.prestaciones.consultaBreve }))).ok).toBe(true);
    expect(
      await crear(entrada(c, { profesionalId: c.profesionales.luis, prestacionId: c.prestaciones.extraccion })),
    ).toEqual({ ok: false, error: { tipo: 'SillonOcupado' } });
  });

  it('rechaza una prestación que el profesional no realiza (Luis no hace limpiezas)', async () => {
    const c = await fixtures.consultorio();
    expect(await crear(entrada(c, { profesionalId: c.profesionales.luis }))).toEqual({
      ok: false,
      error: { tipo: 'PrestacionNoHabilitada' },
    });
  });

  it('rechaza un profesional inactivo', async () => {
    const c = await fixtures.consultorio();
    await admin.db.update(profesional).set({ activo: false }).where(eq(profesional.id, c.profesionales.ana));
    expect(await crear(entrada(c))).toEqual({ ok: false, error: { tipo: 'RecursoInactivo', recurso: 'profesional' } });
  });

  it('rechaza un paciente que no existe en el consultorio, aunque exista en otro', async () => {
    const [c, otro] = await Promise.all([fixtures.consultorio(), fixtures.consultorio()]);
    expect(await crear(entrada(c, { pacienteId: otro.pacientes.principal }))).toEqual({
      ok: false,
      error: { tipo: 'PacienteInexistente' },
    });
  });

  it('rechaza un profesional de otro consultorio como inexistente', async () => {
    const [c, otro] = await Promise.all([fixtures.consultorio(), fixtures.consultorio()]);
    expect(await crear(entrada(c, { profesionalId: otro.profesionales.ana }))).toEqual({
      ok: false,
      error: { tipo: 'RecursoInexistente', recurso: 'profesional' },
    });
  });

  it('rechaza el mismo profesional superpuesto (10:00-10:30 y 10:15-10:45)', async () => {
    const c = await fixtures.consultorio();
    expect((await crear(entrada(c))).ok).toBe(true);
    expect(await crear(entrada(c, { sillonId: c.sillones.box2, inicioLocal: `${DIA}T10:15` }))).toEqual({
      ok: false,
      error: { tipo: 'ProfesionalOcupado' },
    });
  });

  it('acepta turnos contiguos del mismo profesional (10:00-10:30 y 10:30-11:00)', async () => {
    const c = await fixtures.consultorio();
    expect((await crear(entrada(c))).ok).toBe(true);
    expect((await crear(entrada(c, { inicioLocal: `${DIA}T10:30` }))).ok).toBe(true);
  });

  it('acepta otro profesional en el mismo horario con otro sillón', async () => {
    const c = await fixtures.consultorio();
    expect((await crear(entrada(c))).ok).toBe(true);
    expect(
      (await crear(entrada(c, { profesionalId: c.profesionales.luis, prestacionId: c.prestaciones.extraccion, sillonId: c.sillones.box2 }))).ok,
    ).toBe(true);
  });

  it('rechaza el mismo sillón superpuesto con otro profesional (10:00-10:30 y 10:15-11:15)', async () => {
    const c = await fixtures.consultorio();
    expect((await crear(entrada(c))).ok).toBe(true);
    expect(
      await crear(
        entrada(c, { profesionalId: c.profesionales.luis, prestacionId: c.prestaciones.tratamientoConducto, inicioLocal: `${DIA}T10:15` }),
      ),
    ).toEqual({ ok: false, error: { tipo: 'SillonOcupado' } });
  });

  it('acepta turnos sin sillón superpuestos de profesionales distintos', async () => {
    const c = await fixtures.consultorio();
    const consulta = { prestacionId: c.prestaciones.consultaBreve, sillonId: null };
    expect((await crear(entrada(c, consulta))).ok).toBe(true);
    expect((await crear(entrada(c, { ...consulta, profesionalId: c.profesionales.luis }))).ok).toBe(true);
  });

  it('acepta el mismo horario y los mismos nombres de recurso en dos consultorios', async () => {
    const [a, b] = await Promise.all([fixtures.consultorio(), fixtures.consultorio()]);
    expect((await crear(entrada(a))).ok).toBe(true);
    expect((await crear(entrada(b))).ok).toBe(true);
  });

  it('rechaza una entrada inválida sin tocar la base', async () => {
    const c = await fixtures.consultorio();
    expect(await crear({ ...entrada(c), pacienteId: 'no-es-uuid' })).toMatchObject({ ok: false, error: { tipo: 'EntradaInvalida' } });
    expect(await crear({ ...entrada(c), inicioLocal: '2026-02-30T10:00' })).toMatchObject({
      ok: false,
      error: { tipo: 'EntradaInvalida' },
    });
    expect(await crear(null)).toMatchObject({ ok: false, error: { tipo: 'EntradaInvalida' } });
  });
});

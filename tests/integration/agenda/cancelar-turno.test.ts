import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { turno } from '../../../src/shared/db/schema.ts';
import { crearTurno } from '../../../src/features/agenda/application/crear-turno.ts';
import { cancelarTurno } from '../../../src/features/agenda/application/cancelar-turno.ts';
import { crearUnidadDeTrabajo } from '../../../src/features/agenda/infrastructure/repositorio-agenda.drizzle.ts';
import type { ConsultorioDemo } from '../../../db/datos-demo.ts';
import { crearFixtures } from '../fixtures.ts';
import { urlTestAplicacion, urlTestMigraciones } from '../entorno.ts';

// Spec: turnos (cancelar y liberar recursos). El turno empieza el 10/12 a las 10:00 local = 13:00 UTC.

const fixtures = crearFixtures();
const admin = crearConexion(urlTestMigraciones(), { max: 1 });
const app = crearConexion(urlTestAplicacion(), { max: 2 });
const uow = crearUnidadDeTrabajo(app.db);

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), admin.cerrar(), app.cerrar()]);
});

const INICIO = new Date('2026-12-10T13:00:00Z');
const horasAntes = (horas: number): Date => new Date(INICIO.getTime() - horas * 3_600_000);

function datosTurno(c: ConsultorioDemo) {
  return {
    consultorioId: c.id,
    pacienteId: c.pacientes.principal,
    profesionalId: c.profesionales.ana,
    prestacionId: c.prestaciones.limpieza,
    sillonId: c.sillones.box1,
    inicioLocal: '2026-12-10T10:00',
  };
}

async function turnoReservado(): Promise<{ c: ConsultorioDemo; turnoId: string }> {
  const c = await fixtures.consultorio();
  const creado = await crearTurno({ uow }, datosTurno(c));
  if (!creado.ok) throw new Error(`No se pudo crear el turno de prueba: ${creado.error.tipo}`);
  return { c, turnoId: creado.valor.id };
}

const cancelarA = (ahora: Date, entrada: unknown) => cancelarTurno({ uow, reloj: () => ahora }, entrada);

async function leer(turnoId: string) {
  const [fila] = await admin.db
    .select({ estado: turno.estado, canceladoPor: turno.canceladoPor, canceladoEn: turno.canceladoEn })
    .from(turno)
    .where(eq(turno.id, turnoId));
  return fila;
}

describe('cancelarTurno', () => {
  it('con 48 horas de anticipación queda cancelado, por el personal y con la fecha del reloj', async () => {
    const { c, turnoId } = await turnoReservado();
    const ahora = horasAntes(48);
    expect(await cancelarA(ahora, { consultorioId: c.id, turnoId })).toEqual({
      ok: true,
      valor: { id: turnoId, estado: 'cancelado' },
    });
    expect(await leer(turnoId)).toEqual({ estado: 'cancelado', canceladoPor: 'personal', canceladoEn: ahora });
  });

  it('con 23 horas de anticipación queda cancelado_tarde', async () => {
    const { c, turnoId } = await turnoReservado();
    expect(await cancelarA(horasAntes(23), { consultorioId: c.id, turnoId })).toMatchObject({
      ok: true,
      valor: { estado: 'cancelado_tarde' },
    });
    expect((await leer(turnoId))?.estado).toBe('cancelado_tarde');
  });

  it('con exactamente 24 horas de anticipación queda cancelado', async () => {
    const { c, turnoId } = await turnoReservado();
    expect(await cancelarA(horasAntes(24), { consultorioId: c.id, turnoId })).toMatchObject({
      ok: true,
      valor: { estado: 'cancelado' },
    });
  });

  it('rechaza cancelar un turno ya comenzado y no lo cambia', async () => {
    const { c, turnoId } = await turnoReservado();
    expect(await cancelarA(INICIO, { consultorioId: c.id, turnoId })).toEqual({
      ok: false,
      error: { tipo: 'TurnoNoCancelable', motivo: 'ya_comenzo' },
    });
    expect(await leer(turnoId)).toEqual({ estado: 'reservado', canceladoPor: null, canceladoEn: null });
  });

  it('rechaza cancelar un turno que ya no está reservado y no lo cambia', async () => {
    const { c, turnoId } = await turnoReservado();
    const primera = horasAntes(48);
    await cancelarA(primera, { consultorioId: c.id, turnoId });
    expect(await cancelarA(horasAntes(10), { consultorioId: c.id, turnoId })).toEqual({
      ok: false,
      error: { tipo: 'TurnoNoCancelable', motivo: 'estado_no_reservado' },
    });
    expect(await leer(turnoId)).toEqual({ estado: 'cancelado', canceladoPor: 'personal', canceladoEn: primera });
  });

  it('no encuentra un turno de otro consultorio y no lo cambia', async () => {
    const { turnoId } = await turnoReservado();
    const otro = await fixtures.consultorio();
    expect(await cancelarA(horasAntes(48), { consultorioId: otro.id, turnoId })).toEqual({
      ok: false,
      error: { tipo: 'TurnoNoEncontrado' },
    });
    expect((await leer(turnoId))?.estado).toBe('reservado');
  });

  it('libera el profesional y el sillón: el mismo horario se puede volver a reservar', async () => {
    const { c, turnoId } = await turnoReservado();
    expect((await crearTurno({ uow }, datosTurno(c))).ok).toBe(false);
    await cancelarA(horasAntes(48), { consultorioId: c.id, turnoId });
    expect(await crearTurno({ uow }, datosTurno(c))).toMatchObject({ ok: true, valor: { estado: 'reservado' } });
  });

  it('rechaza una entrada inválida', async () => {
    expect(await cancelarA(horasAntes(48), { consultorioId: 'x', turnoId: 'y' })).toMatchObject({
      ok: false,
      error: { tipo: 'EntradaInvalida' },
    });
  });
});

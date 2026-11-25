import { describe, expect, it } from 'vitest';
import {
  decidirCancelacion,
  planificarTurno,
  type Planificacion,
} from '../../../src/features/agenda/domain/turno.ts';

const inicio = new Date('2026-12-01T13:00:00Z');

function planificacion(cambios: Partial<Planificacion> = {}): Planificacion {
  return {
    inicio,
    prestacion: { id: 'limpieza', duracionMinutos: 30, requiereSillon: true, activa: true },
    profesional: { id: 'ana', activo: true, habilitadoParaLaPrestacion: true },
    sillon: { id: 'box1', activo: true },
    ...cambios,
  };
}

describe('planificarTurno', () => {
  it('calcula el fin como inicio más la duración de la prestación (30 minutos)', () => {
    expect(planificarTurno(planificacion())).toEqual({
      ok: true,
      valor: { rango: { inicio, fin: new Date('2026-12-01T13:30:00Z') }, sillonId: 'box1' },
    });
  });

  it('calcula el fin para una prestación de 45 minutos', () => {
    const resultado = planificarTurno(
      planificacion({ prestacion: { id: 'extraccion', duracionMinutos: 45, requiereSillon: true, activa: true } }),
    );
    expect(resultado.ok && resultado.valor.rango.fin).toEqual(new Date('2026-12-01T13:45:00Z'));
  });

  it('rechaza un turno sin sillón si la prestación lo requiere', () => {
    expect(planificarTurno(planificacion({ sillon: null }))).toEqual({ ok: false, error: { tipo: 'SillonRequerido' } });
  });

  it('acepta sin sillón una prestación que no lo requiere (consulta breve)', () => {
    const consulta = { id: 'consulta', duracionMinutos: 15, requiereSillon: false, activa: true };
    expect(planificarTurno(planificacion({ prestacion: consulta, sillon: null }))).toEqual({
      ok: true,
      valor: { rango: { inicio, fin: new Date('2026-12-01T13:15:00Z') }, sillonId: null },
    });
  });

  it('acepta y conserva un sillón indicado aunque la prestación no lo requiera', () => {
    const consulta = { id: 'consulta', duracionMinutos: 15, requiereSillon: false, activa: true };
    const resultado = planificarTurno(planificacion({ prestacion: consulta }));
    expect(resultado.ok && resultado.valor.sillonId).toBe('box1');
  });

  it('rechaza una prestación que el profesional no realiza', () => {
    expect(
      planificarTurno(planificacion({ profesional: { id: 'luis', activo: true, habilitadoParaLaPrestacion: false } })),
    ).toEqual({ ok: false, error: { tipo: 'PrestacionNoHabilitada' } });
  });

  it('rechaza un profesional inactivo', () => {
    expect(
      planificarTurno(planificacion({ profesional: { id: 'ana', activo: false, habilitadoParaLaPrestacion: true } })),
    ).toEqual({ ok: false, error: { tipo: 'RecursoInactivo', recurso: 'profesional' } });
  });

  it('rechaza una prestación inactiva', () => {
    expect(
      planificarTurno(
        planificacion({ prestacion: { id: 'limpieza', duracionMinutos: 30, requiereSillon: true, activa: false } }),
      ),
    ).toEqual({ ok: false, error: { tipo: 'RecursoInactivo', recurso: 'prestacion' } });
  });

  it('rechaza un sillón inactivo', () => {
    expect(planificarTurno(planificacion({ sillon: { id: 'box1', activo: false } }))).toEqual({
      ok: false,
      error: { tipo: 'RecursoInactivo', recurso: 'sillon' },
    });
  });
});

describe('decidirCancelacion', () => {
  const horasAntes = (horas: number): Date => new Date(inicio.getTime() - horas * 3_600_000);

  it('con 48 horas de anticipación el turno queda cancelado', () => {
    expect(decidirCancelacion({ estado: 'reservado', inicio }, horasAntes(48))).toEqual({ ok: true, valor: 'cancelado' });
  });

  it('con exactamente 24 horas de anticipación el turno queda cancelado', () => {
    expect(decidirCancelacion({ estado: 'reservado', inicio }, horasAntes(24))).toEqual({ ok: true, valor: 'cancelado' });
  });

  it('con 23 horas de anticipación el turno queda cancelado_tarde', () => {
    expect(decidirCancelacion({ estado: 'reservado', inicio }, horasAntes(23))).toEqual({
      ok: true,
      valor: 'cancelado_tarde',
    });
  });

  it('un minuto antes del inicio el turno queda cancelado_tarde', () => {
    expect(decidirCancelacion({ estado: 'reservado', inicio }, horasAntes(1 / 60))).toEqual({
      ok: true,
      valor: 'cancelado_tarde',
    });
  });

  it('rechaza cancelar un turno que ya comenzó', () => {
    expect(decidirCancelacion({ estado: 'reservado', inicio }, inicio)).toEqual({
      ok: false,
      error: { tipo: 'TurnoNoCancelable', motivo: 'ya_comenzo' },
    });
  });

  it.each(['atendido', 'ausente', 'cancelado', 'cancelado_tarde'] as const)(
    'rechaza cancelar un turno en estado %s',
    (estado) => {
      expect(decidirCancelacion({ estado, inicio }, horasAntes(48))).toEqual({
        ok: false,
        error: { tipo: 'TurnoNoCancelable', motivo: 'estado_no_reservado' },
      });
    },
  );
});

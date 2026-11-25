import { horasEntre } from '../../../shared/time/index.ts';
import { exito, rechazo, type Resultado } from './errores.ts';

/** Dominio puro de turnos: no conoce la base de datos ni el framework. */

export type EstadoTurno = 'reservado' | 'atendido' | 'ausente' | 'cancelado' | 'cancelado_tarde';
export type EstadoCancelado = 'cancelado' | 'cancelado_tarde';

export interface Rango {
  inicio: Date;
  fin: Date;
}

export interface Planificacion {
  inicio: Date;
  prestacion: { id: string; duracionMinutos: number; requiereSillon: boolean; activa: boolean };
  profesional: { id: string; activo: boolean; habilitadoParaLaPrestacion: boolean };
  /** `null` cuando no se indicó sillón. */
  sillon: { id: string; activo: boolean } | null;
}

export interface TurnoPlanificado {
  rango: Rango;
  sillonId: string | null;
}

const MS_POR_MINUTO = 60_000;
const HORAS_CANCELACION_SIN_PENALIDAD = 24;

/**
 * Valida un turno nuevo y calcula su rango `[inicio, fin)`.
 * RN-AG-03 (sillón requerido), RN-AG-04 (duración de la prestación) y RN-AG-07 (prestación habilitada).
 * Los solapamientos los garantiza la base de datos, no esta función.
 */
export function planificarTurno(p: Planificacion): Resultado<TurnoPlanificado> {
  if (!p.profesional.activo) return rechazo({ tipo: 'RecursoInactivo', recurso: 'profesional' });
  if (!p.prestacion.activa) return rechazo({ tipo: 'RecursoInactivo', recurso: 'prestacion' });
  if (p.sillon && !p.sillon.activo) return rechazo({ tipo: 'RecursoInactivo', recurso: 'sillon' });
  if (!p.profesional.habilitadoParaLaPrestacion) return rechazo({ tipo: 'PrestacionNoHabilitada' });
  if (p.prestacion.requiereSillon && !p.sillon) return rechazo({ tipo: 'SillonRequerido' });

  const fin = new Date(p.inicio.getTime() + p.prestacion.duracionMinutos * MS_POR_MINUTO);
  return exito({ rango: { inicio: p.inicio, fin }, sillonId: p.sillon?.id ?? null });
}

/**
 * Decide el estado de un turno cancelado por el personal (RN-CA-02, RN-CA-03).
 * Con 24 horas o más de anticipación es `cancelado`; con menos, `cancelado_tarde`.
 */
export function decidirCancelacion(
  t: { estado: EstadoTurno; inicio: Date },
  ahora: Date,
): Resultado<EstadoCancelado> {
  if (t.estado !== 'reservado') return rechazo({ tipo: 'TurnoNoCancelable', motivo: 'estado_no_reservado' });
  const anticipacion = horasEntre(ahora, t.inicio);
  if (anticipacion <= 0) return rechazo({ tipo: 'TurnoNoCancelable', motivo: 'ya_comenzo' });
  return exito(anticipacion >= HORAS_CANCELACION_SIN_PENALIDAD ? 'cancelado' : 'cancelado_tarde');
}

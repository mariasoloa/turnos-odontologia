import type { Resultado } from '../domain/errores.ts';
import type { EstadoCancelado, EstadoTurno, Rango } from '../domain/turno.ts';

/** Datos de un turno ya validado por el dominio, listo para guardarse. */
export interface NuevoTurno {
  pacienteId: string;
  profesionalId: string;
  sillonId: string | null;
  prestacionId: string;
  rango: Rango;
}

export interface TurnoGuardado {
  id: string;
  pacienteId: string;
  profesionalId: string;
  sillonId: string | null;
  prestacionId: string;
  inicio: Date;
  fin: Date;
  estado: EstadoTurno;
  origen: 'online' | 'personal';
}

/**
 * Acceso a la agenda de UN consultorio; siempre se usa dentro de una unidad de trabajo.
 * Las lecturas devuelven `null` si el recurso no existe en el consultorio (RLS y filtro por consultorio).
 */
export interface RepositorioAgenda {
  zonaHoraria(): Promise<string | null>;
  pacienteExiste(pacienteId: string): Promise<boolean>;
  profesional(profesionalId: string): Promise<{ id: string; activo: boolean } | null>;
  prestacion(
    prestacionId: string,
  ): Promise<{ id: string; duracionMinutos: number; requiereSillon: boolean; activa: boolean } | null>;
  sillon(sillonId: string): Promise<{ id: string; activo: boolean } | null>;
  estaHabilitada(prestacionId: string, profesionalId: string): Promise<boolean>;
  /** Inserta un turno `reservado` de origen `personal`. Un solapamiento es un rechazo, no una excepción. */
  insertarTurno(nuevo: NuevoTurno): Promise<Resultado<TurnoGuardado>>;
  /** Lee el turno bloqueándolo (`FOR UPDATE`) para que dos cancelaciones simultáneas no se pisen. */
  turnoParaCancelar(turnoId: string): Promise<{ id: string; estado: EstadoTurno; inicio: Date } | null>;
  marcarCancelado(turnoId: string, estado: EstadoCancelado, canceladoEn: Date): Promise<void>;
}

/** Abre una transacción acotada a un consultorio (withTenant) y entrega el repositorio. */
export interface UnidadDeTrabajo {
  enConsultorio<T>(consultorioId: string, fn: (repo: RepositorioAgenda) => Promise<T>): Promise<T>;
}

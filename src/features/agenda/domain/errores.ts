export type Recurso = 'consultorio' | 'profesional' | 'sillon' | 'prestacion';

/** Rechazos de negocio de la agenda (design D4). No se usan excepciones para estos casos. */
export type ErrorAgenda =
  | { tipo: 'EntradaInvalida'; detalle: string }
  | { tipo: 'PacienteInexistente' }
  | { tipo: 'RecursoInexistente'; recurso: Recurso }
  | { tipo: 'RecursoInactivo'; recurso: Recurso }
  | { tipo: 'PrestacionNoHabilitada' }
  | { tipo: 'SillonRequerido' }
  | { tipo: 'ProfesionalOcupado' }
  | { tipo: 'SillonOcupado' }
  | { tipo: 'TurnoNoEncontrado' }
  | { tipo: 'TurnoNoCancelable'; motivo: 'ya_comenzo' | 'estado_no_reservado' };

export type Resultado<T> = { ok: true; valor: T } | { ok: false; error: ErrorAgenda };

export const exito = <T>(valor: T): Resultado<T> => ({ ok: true, valor });
export const rechazo = <T = never>(error: ErrorAgenda): Resultado<T> => ({ ok: false, error });

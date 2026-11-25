export interface ErrorPostgres {
  code: string;
  constraint?: string;
}

/** Busca el error del driver `pg` dentro de la cadena `cause` (Drizzle lo envuelve en DrizzleQueryError). */
export function errorPostgres(error: unknown): ErrorPostgres | undefined {
  let actual: unknown = error;
  for (let profundidad = 0; actual instanceof Error && profundidad < 5; profundidad++) {
    if ('code' in actual && typeof actual.code === 'string') {
      const constraint = 'constraint' in actual && typeof actual.constraint === 'string' ? actual.constraint : undefined;
      return constraint ? { code: actual.code, constraint } : { code: actual.code };
    }
    actual = actual.cause;
  }
  return undefined;
}

export const VIOLACION_DE_EXCLUSION = '23P01';

/**
 * Errores transitorios de concurrencia: la transacción entera puede reintentarse.
 * 40P01 (deadlock) aparece con restricciones EXCLUDE cuando dos inserciones superpuestas corren a la vez:
 * cada una registra su entrada en el índice y espera a la otra antes de verificar.
 */
export const ERRORES_REINTENTABLES: ReadonlySet<string> = new Set(['40P01', '40001']);

export function esReintentable(error: unknown): boolean {
  const pg = errorPostgres(error);
  return pg !== undefined && ERRORES_REINTENTABLES.has(pg.code);
}

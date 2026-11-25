import { z } from 'zod';
import { exito, rechazo, type Resultado } from '../domain/errores.ts';
import { decidirCancelacion, type EstadoCancelado } from '../domain/turno.ts';
import type { UnidadDeTrabajo } from './puertos.ts';

const esquemaEntrada = z.object({
  consultorioId: z.string().uuid(),
  turnoId: z.string().uuid(),
});

export interface DependenciasCancelarTurno {
  uow: UnidadDeTrabajo;
  /** Reloj inyectado (design D7): los tests fijan la hora para probar la regla de 24 horas. */
  reloj: () => Date;
}

/**
 * Cancela un turno `reservado` por pedido del personal (RN-CA-02).
 * El turno cancelado deja de ocupar al profesional y al sillón (RN-AG-08): las restricciones EXCLUDE
 * solo consideran los estados activos.
 */
export async function cancelarTurno(
  deps: DependenciasCancelarTurno,
  entrada: unknown,
): Promise<Resultado<{ id: string; estado: EstadoCancelado }>> {
  const datos = esquemaEntrada.safeParse(entrada);
  if (!datos.success) {
    return rechazo({ tipo: 'EntradaInvalida', detalle: datos.error.issues.map((i) => i.path.join('.') || 'entrada').join(', ') });
  }
  const { consultorioId, turnoId } = datos.data;

  return deps.uow.enConsultorio(consultorioId, async (repo) => {
    const actual = await repo.turnoParaCancelar(turnoId);
    if (!actual) return rechazo({ tipo: 'TurnoNoEncontrado' });

    const ahora = deps.reloj();
    const decision = decidirCancelacion(actual, ahora);
    if (!decision.ok) return decision;

    await repo.marcarCancelado(turnoId, decision.valor, ahora);
    return exito({ id: turnoId, estado: decision.valor });
  });
}

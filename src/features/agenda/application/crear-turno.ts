import { z } from 'zod';
import { localAUtc } from '../../../shared/time/index.ts';
import { rechazo, type Resultado } from '../domain/errores.ts';
import { planificarTurno } from '../domain/turno.ts';
import type { TurnoGuardado, UnidadDeTrabajo } from './puertos.ts';

const esquemaEntrada = z.object({
  consultorioId: z.string().uuid(),
  pacienteId: z.string().uuid(),
  profesionalId: z.string().uuid(),
  prestacionId: z.string().uuid(),
  sillonId: z.string().uuid().nullable().optional(),
  /** Fecha y hora local del consultorio, `YYYY-MM-DDTHH:mm`. */
  inicioLocal: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
});

export type EntradaCrearTurno = z.infer<typeof esquemaEntrada>;

export interface DependenciasCrearTurno {
  uow: UnidadDeTrabajo;
}

/**
 * Crea un turno `reservado` de origen `personal` (spec turnos).
 * Valida la entrada con Zod, carga los recursos dentro de withTenant, aplica el dominio e inserta.
 * Los solapamientos los rechaza la base de datos (restricciones EXCLUDE) y llegan como error tipado.
 */
export async function crearTurno(deps: DependenciasCrearTurno, entrada: unknown): Promise<Resultado<TurnoGuardado>> {
  const datos = esquemaEntrada.safeParse(entrada);
  if (!datos.success) {
    return rechazo({ tipo: 'EntradaInvalida', detalle: datos.error.issues.map((i) => i.path.join('.') || 'entrada').join(', ') });
  }
  const e = datos.data;

  return deps.uow.enConsultorio(e.consultorioId, async (repo) => {
    const zona = await repo.zonaHoraria();
    if (!zona) return rechazo({ tipo: 'RecursoInexistente', recurso: 'consultorio' });

    let inicio: Date;
    try {
      inicio = localAUtc(e.inicioLocal, zona);
    } catch {
      return rechazo({ tipo: 'EntradaInvalida', detalle: 'inicioLocal' });
    }

    if (!(await repo.pacienteExiste(e.pacienteId))) return rechazo({ tipo: 'PacienteInexistente' });

    const profesional = await repo.profesional(e.profesionalId);
    if (!profesional) return rechazo({ tipo: 'RecursoInexistente', recurso: 'profesional' });
    const prestacion = await repo.prestacion(e.prestacionId);
    if (!prestacion) return rechazo({ tipo: 'RecursoInexistente', recurso: 'prestacion' });
    const sillon = e.sillonId ? await repo.sillon(e.sillonId) : null;
    if (e.sillonId && !sillon) return rechazo({ tipo: 'RecursoInexistente', recurso: 'sillon' });

    const plan = planificarTurno({
      inicio,
      prestacion,
      profesional: { ...profesional, habilitadoParaLaPrestacion: await repo.estaHabilitada(prestacion.id, profesional.id) },
      sillon,
    });
    if (!plan.ok) return plan;

    return repo.insertarTurno({
      pacienteId: e.pacienteId,
      profesionalId: profesional.id,
      prestacionId: prestacion.id,
      sillonId: plan.valor.sillonId,
      rango: plan.valor.rango,
    });
  });
}

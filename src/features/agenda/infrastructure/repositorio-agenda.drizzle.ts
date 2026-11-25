import { and, eq, isNull } from 'drizzle-orm';
import type { Db, Tx } from '../../../shared/db/index.ts';
import {
  consultorio,
  paciente,
  prestacion,
  prestacionProfesional,
  profesional,
  sillon,
  turno,
} from '../../../shared/db/schema.ts';
import { withTenant } from '../../../shared/db/with-tenant.ts';
import { errorPostgres, esReintentable, VIOLACION_DE_EXCLUSION } from '../../../shared/db/errores-postgres.ts';
import { exito, rechazo, type ErrorAgenda, type Resultado } from '../domain/errores.ts';
import type { NuevoTurno, RepositorioAgenda, TurnoGuardado, UnidadDeTrabajo } from '../application/puertos.ts';

/** Traducción de las restricciones EXCLUDE (design D2). Los nombres vienen de la migración 0004. */
const ERROR_POR_RESTRICCION: Record<string, ErrorAgenda> = {
  turno_sin_solapamiento_profesional: { tipo: 'ProfesionalOcupado' },
  turno_sin_solapamiento_sillon: { tipo: 'SillonOcupado' },
};

function repositorio(tx: Tx, consultorioId: string): RepositorioAgenda {
  // Además de RLS, cada lectura filtra por consultorio de forma explícita (defensa en profundidad).
  return {
    async zonaHoraria() {
      const [fila] = await tx
        .select({ zona: consultorio.zonaHoraria })
        .from(consultorio)
        .where(eq(consultorio.id, consultorioId));
      return fila?.zona ?? null;
    },

    async pacienteExiste(pacienteId) {
      const filas = await tx
        .select({ id: paciente.id })
        .from(paciente)
        .where(and(eq(paciente.tenantId, consultorioId), eq(paciente.id, pacienteId), isNull(paciente.anonimizadoEn)));
      return filas.length > 0;
    },

    async profesional(profesionalId) {
      const [fila] = await tx
        .select({ id: profesional.id, activo: profesional.activo })
        .from(profesional)
        .where(and(eq(profesional.tenantId, consultorioId), eq(profesional.id, profesionalId)));
      return fila ?? null;
    },

    async prestacion(prestacionId) {
      const [fila] = await tx
        .select({
          id: prestacion.id,
          duracionMinutos: prestacion.duracionMinutos,
          requiereSillon: prestacion.requiereSillon,
          activa: prestacion.activa,
        })
        .from(prestacion)
        .where(and(eq(prestacion.tenantId, consultorioId), eq(prestacion.id, prestacionId)));
      return fila ?? null;
    },

    async sillon(sillonId) {
      const [fila] = await tx
        .select({ id: sillon.id, activo: sillon.activo })
        .from(sillon)
        .where(and(eq(sillon.tenantId, consultorioId), eq(sillon.id, sillonId)));
      return fila ?? null;
    },

    async estaHabilitada(prestacionId, profesionalId) {
      const filas = await tx
        .select({ prestacionId: prestacionProfesional.prestacionId })
        .from(prestacionProfesional)
        .where(
          and(
            eq(prestacionProfesional.tenantId, consultorioId),
            eq(prestacionProfesional.prestacionId, prestacionId),
            eq(prestacionProfesional.profesionalId, profesionalId),
          ),
        );
      return filas.length > 0;
    },

    async insertarTurno(nuevo: NuevoTurno): Promise<Resultado<TurnoGuardado>> {
      try {
        // Transacción anidada = SAVEPOINT: un rechazo no aborta la transacción de afuera.
        const [fila] = await tx.transaction((sp) =>
          sp
            .insert(turno)
            .values({ tenantId: consultorioId, ...nuevo, estado: 'reservado', origen: 'personal' })
            .returning(),
        );
        if (!fila) throw new Error('La inserción del turno no devolvió la fila');
        return exito({
          id: fila.id,
          pacienteId: fila.pacienteId,
          profesionalId: fila.profesionalId,
          sillonId: fila.sillonId,
          prestacionId: fila.prestacionId,
          inicio: fila.rango.inicio,
          fin: fila.rango.fin,
          estado: fila.estado,
          origen: fila.origen,
        });
      } catch (error) {
        const pg = errorPostgres(error);
        const traducido = pg?.code === VIOLACION_DE_EXCLUSION && pg.constraint ? ERROR_POR_RESTRICCION[pg.constraint] : undefined;
        if (traducido) return rechazo(traducido);
        throw error;
      }
    },

    async turnoParaCancelar(turnoId) {
      const [fila] = await tx
        .select({ id: turno.id, estado: turno.estado, rango: turno.rango })
        .from(turno)
        .where(and(eq(turno.tenantId, consultorioId), eq(turno.id, turnoId)))
        .for('update');
      return fila ? { id: fila.id, estado: fila.estado, inicio: fila.rango.inicio } : null;
    },

    async marcarCancelado(turnoId, estado, canceladoEn) {
      await tx
        .update(turno)
        .set({ estado, canceladoEn, canceladoPor: 'personal', updatedAt: canceladoEn })
        .where(and(eq(turno.tenantId, consultorioId), eq(turno.id, turnoId)));
    },
  };
}

const MAX_INTENTOS = 3;

const esperar = (ms: number): Promise<void> => new Promise((resolver) => setTimeout(resolver, ms));

/**
 * Cada llamada es una transacción completa acotada al consultorio. Ante un deadlock o un fallo de
 * serialización se reintenta la transacción entera: en el reintento el turno rival ya está confirmado
 * y la restricción EXCLUDE devuelve 23P01, que se traduce al error de dominio correcto.
 * Es seguro porque `fn` no tiene efectos fuera de la transacción (las notificaciones van al outbox).
 */
export function crearUnidadDeTrabajo(db: Db): UnidadDeTrabajo {
  return {
    async enConsultorio(consultorioId, fn) {
      for (let intento = 1; ; intento++) {
        try {
          return await withTenant(db, consultorioId, (tx) => fn(repositorio(tx, consultorioId)));
        } catch (error) {
          if (intento >= MAX_INTENTOS || !esReintentable(error)) throw error;
          await esperar(Math.random() * 20 * intento);
        }
      }
    },
  };
}

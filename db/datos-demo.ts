import type { Db } from '../src/shared/db/index.ts';
import {
  consultorio,
  paciente,
  prestacion,
  prestacionProfesional,
  profesional,
  sillon,
} from '../src/shared/db/schema.ts';

/** Identificadores del consultorio de demostración creado con datos ficticios. */
export interface ConsultorioDemo {
  id: string;
  slug: string;
  profesionales: { ana: string; luis: string };
  sillones: { box1: string; box2: string };
  prestaciones: { consultaBreve: string; limpieza: string; extraccion: string; tratamientoConducto: string };
  pacientes: { principal: string; secundario: string };
}

function primero<T>(filas: T[], que: string): T {
  const fila = filas[0];
  if (!fila) throw new Error(`No se pudo crear ${que}`);
  return fila;
}

/**
 * Inserta el consultorio Demo de `knowledge-base/04_modelo_de_datos.md` con datos ficticios.
 * Debe ejecutarse con el rol de migraciones (sin RLS), porque crea el consultorio.
 * Habilitaciones: Ana realiza todas las prestaciones; Luis todas menos la limpieza.
 */
export async function insertarConsultorioDemo(db: Db, datos: { nombre: string; slug: string }): Promise<ConsultorioDemo> {
  return db.transaction(async (tx) => {
    const { id } = primero(
      await tx.insert(consultorio).values({ nombre: datos.nombre, slug: datos.slug }).returning({ id: consultorio.id }),
      'el consultorio',
    );

    const [ana, luis] = await tx
      .insert(profesional)
      .values([
        { tenantId: id, nombre: 'Dra. Ana Demo', especialidad: 'Odontología general', orden: 1 },
        { tenantId: id, nombre: 'Dr. Luis Demo', especialidad: 'Endodoncia', orden: 2 },
      ])
      .returning({ id: profesional.id });

    const [box1, box2] = await tx
      .insert(sillon)
      .values([
        { tenantId: id, nombre: 'Box 1' },
        { tenantId: id, nombre: 'Box 2' },
      ])
      .returning({ id: sillon.id });

    const [consultaBreve, limpieza, extraccion, tratamientoConducto] = await tx
      .insert(prestacion)
      .values([
        { tenantId: id, nombre: 'Consulta breve', duracionMinutos: 15, requiereSillon: false },
        { tenantId: id, nombre: 'Limpieza', duracionMinutos: 30 },
        { tenantId: id, nombre: 'Extracción', duracionMinutos: 45 },
        { tenantId: id, nombre: 'Tratamiento de conducto', duracionMinutos: 60 },
      ])
      .returning({ id: prestacion.id });

    if (!ana || !luis || !box1 || !box2 || !consultaBreve || !limpieza || !extraccion || !tratamientoConducto) {
      throw new Error('No se pudieron crear los recursos del consultorio demo');
    }

    await tx.insert(prestacionProfesional).values([
      ...[consultaBreve, limpieza, extraccion, tratamientoConducto].map((p) => ({
        tenantId: id,
        prestacionId: p.id,
        profesionalId: ana.id,
      })),
      ...[consultaBreve, extraccion, tratamientoConducto].map((p) => ({
        tenantId: id,
        prestacionId: p.id,
        profesionalId: luis.id,
      })),
    ]);

    const [principal, secundario] = await tx
      .insert(paciente)
      .values([
        { tenantId: id, nombre: 'Paciente', apellido: 'Ficticio Uno', dni: '10000001', email: 'paciente1@ejemplo.test' },
        { tenantId: id, nombre: 'Paciente', apellido: 'Ficticio Dos', dni: '10000002' },
      ])
      .returning({ id: paciente.id });

    if (!principal || !secundario) throw new Error('No se pudieron crear los pacientes del consultorio demo');

    return {
      id,
      slug: datos.slug,
      profesionales: { ana: ana.id, luis: luis.id },
      sillones: { box1: box1.id, box2: box2.id },
      prestaciones: {
        consultaBreve: consultaBreve.id,
        limpieza: limpieza.id,
        extraccion: extraccion.id,
        tratamientoConducto: tratamientoConducto.id,
      },
      pacientes: { principal: principal.id, secundario: secundario.id },
    };
  });
}

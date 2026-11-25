import { crearConexion } from '../../src/shared/db/index.ts';
import { insertarConsultorioDemo, type ConsultorioDemo } from '../../db/datos-demo.ts';
import { urlTestMigraciones } from './entorno.ts';

export interface Fixtures {
  /** Crea un consultorio ficticio nuevo (slug único) con sus recursos y pacientes. */
  consultorio(): Promise<ConsultorioDemo>;
  cerrar(): Promise<void>;
}

/**
 * Datos de prueba creados con el rol de migraciones (sin RLS). Cada consultorio es nuevo,
 * así los tests no necesitan limpiar la base entre sí y pueden correr en paralelo.
 */
export function crearFixtures(): Fixtures {
  const conexion = crearConexion(urlTestMigraciones(), { max: 2 });
  return {
    consultorio: () => {
      const sufijo = crypto.randomUUID();
      return insertarConsultorioDemo(conexion.db, { nombre: `Consultorio de prueba ${sufijo.slice(0, 8)}`, slug: `prueba-${sufijo}` });
    },
    cerrar: () => conexion.cerrar(),
  };
}

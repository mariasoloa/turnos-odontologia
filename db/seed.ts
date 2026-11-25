import { eq } from 'drizzle-orm';
import { urlBaseDeDatos } from '../src/shared/config.ts';
import { crearConexion } from '../src/shared/db/index.ts';
import { consultorio } from '../src/shared/db/schema.ts';
import { insertarConsultorioDemo } from './datos-demo.ts';

// Carga el consultorio Demo con datos ficticios. Idempotente: si ya existe, no hace nada.
// Usa el rol de migraciones porque crea el consultorio (la app no puede, por RLS).

const SLUG_DEMO = 'demo';

const conexion = crearConexion(urlBaseDeDatos('DATABASE_URL_MIGRACIONES'), { max: 1 });
try {
  const [existente] = await conexion.db
    .select({ id: consultorio.id })
    .from(consultorio)
    .where(eq(consultorio.slug, SLUG_DEMO));
  if (existente) {
    console.log('El consultorio Demo ya existe; no se cargó nada.');
  } else {
    await insertarConsultorioDemo(conexion.db, { nombre: 'Consultorio Demo', slug: SLUG_DEMO });
    console.log('Consultorio Demo cargado (2 profesionales, 2 sillones, 4 prestaciones, 2 pacientes ficticios).');
  }
} finally {
  await conexion.cerrar();
}

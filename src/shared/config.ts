import { z } from 'zod';

let entornoCargado = false;

/** Carga `.env` si existe. En CI las variables llegan directamente del entorno. */
export function cargarEntorno(): void {
  if (entornoCargado) return;
  entornoCargado = true;
  try {
    process.loadEnvFile('.env');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

const urlPostgres = z
  .string()
  .url()
  .refine((valor) => /^postgres(ql)?:\/\//.test(valor), 'debe empezar con postgres://');

export type NombreVariable =
  | 'DATABASE_URL'
  | 'DATABASE_URL_MIGRACIONES'
  | 'DATABASE_URL_TEST'
  | 'DATABASE_URL_TEST_MIGRACIONES';

/** Lee una URL de conexión obligatoria. Nunca incluye el valor en el mensaje de error. */
export function urlBaseDeDatos(nombre: NombreVariable): string {
  cargarEntorno();
  const resultado = urlPostgres.safeParse(process.env[nombre]);
  if (!resultado.success) {
    throw new Error(`La variable ${nombre} falta o no es una URL postgres:// válida. Ver .env.example.`);
  }
  return resultado.data;
}

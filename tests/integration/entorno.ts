import { urlBaseDeDatos } from '../../src/shared/config.ts';

/** Conexión como rol de la aplicación (sujeto a RLS) sobre la base de tests. */
export const urlTestAplicacion = (): string => urlBaseDeDatos('DATABASE_URL_TEST');

/** Conexión como rol de migraciones (sin RLS) sobre la base de tests; solo para preparar datos. */
export const urlTestMigraciones = (): string => urlBaseDeDatos('DATABASE_URL_TEST_MIGRACIONES');

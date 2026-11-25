import { aplicarMigraciones, asegurarRolAplicacion, recrearBase } from '../../db/herramientas.ts';
import { urlTestAplicacion, urlTestMigraciones } from './entorno.ts';

/** Recrea la base de tests y aplica las migraciones antes de correr la suite de integración. */
export default async function prepararBaseDeTests(): Promise<void> {
  const admin = urlTestMigraciones();
  await recrearBase(admin);
  await aplicarMigraciones(admin);
  await asegurarRolAplicacion(admin, urlTestAplicacion());
}

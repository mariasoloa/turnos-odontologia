import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const CARPETA_MIGRACIONES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

/** Rol de grupo (NOLOGIN) creado por las migraciones: tiene los permisos sobre las tablas. */
export const ROL_GRUPO_APLICACION = 'app_user';

function nombreBase(url: string): string {
  const nombre = decodeURIComponent(new URL(url).pathname.slice(1));
  if (!nombre) throw new Error('La URL de conexión no indica la base de datos.');
  return nombre;
}

function urlDeServidor(url: string): string {
  const u = new URL(url);
  u.pathname = '/postgres';
  return u.toString();
}

async function conServidor<T>(urlAdmin: string, fn: (cliente: pg.Client) => Promise<T>): Promise<T> {
  const cliente = new pg.Client({ connectionString: urlDeServidor(urlAdmin) });
  await cliente.connect();
  try {
    return await fn(cliente);
  } finally {
    await cliente.end();
  }
}

/** Crea la base indicada en `urlAdmin` si todavía no existe. */
export async function asegurarBase(urlAdmin: string): Promise<void> {
  const base = nombreBase(urlAdmin);
  await conServidor(urlAdmin, async (cliente) => {
    const { rowCount } = await cliente.query('select 1 from pg_database where datname = $1', [base]);
    if (!rowCount) await cliente.query(`create database ${pg.escapeIdentifier(base)}`);
  });
}

/** Borra y vuelve a crear la base indicada en `urlAdmin` (solo para tests). */
export async function recrearBase(urlAdmin: string): Promise<void> {
  const base = nombreBase(urlAdmin);
  if (!base.endsWith('_test')) {
    throw new Error(`Por seguridad solo se recrean bases cuyo nombre termina en _test (recibido: ${base}).`);
  }
  await conServidor(urlAdmin, async (cliente) => {
    await cliente.query(`drop database if exists ${pg.escapeIdentifier(base)} with (force)`);
    await cliente.query(`create database ${pg.escapeIdentifier(base)}`);
  });
}

/** Aplica las migraciones pendientes con el rol de migraciones. */
export async function aplicarMigraciones(urlAdmin: string): Promise<void> {
  const pool = new pg.Pool({ connectionString: urlAdmin, max: 1 });
  try {
    await migrate(drizzle(pool), { migrationsFolder: CARPETA_MIGRACIONES });
  } finally {
    await pool.end();
  }
}

/**
 * Crea (o actualiza la clave de) el rol de login de la aplicación y lo hace miembro de `app_user`.
 * El rol no es superusuario, no tiene BYPASSRLS y no es dueño de las tablas.
 */
export async function asegurarRolAplicacion(urlAdmin: string, urlAplicacion: string): Promise<void> {
  const app = new URL(urlAplicacion);
  const usuario = decodeURIComponent(app.username);
  const clave = decodeURIComponent(app.password);
  if (!usuario || !clave) throw new Error('La URL de la aplicación debe incluir usuario y clave.');
  if (usuario === decodeURIComponent(new URL(urlAdmin).username)) {
    throw new Error('El usuario de la aplicación no puede ser el mismo que el de migraciones.');
  }
  await conServidor(urlAdmin, async (cliente) => {
    const { rowCount } = await cliente.query('select 1 from pg_roles where rolname = $1', [usuario]);
    const accion = rowCount ? 'alter' : 'create';
    await cliente.query(
      `${accion} role ${pg.escapeIdentifier(usuario)} with login nosuperuser nobypassrls nocreatedb nocreaterole inherit password ${pg.escapeLiteral(clave)}`,
    );
    await cliente.query(`grant ${pg.escapeIdentifier(ROL_GRUPO_APLICACION)} to ${pg.escapeIdentifier(usuario)}`);
  });
}

/** Prepara una base completa: la crea si falta, aplica migraciones y asegura el rol de la aplicación. */
export async function prepararBase(urlAdmin: string, urlAplicacion: string): Promise<void> {
  await asegurarBase(urlAdmin);
  await aplicarMigraciones(urlAdmin);
  await asegurarRolAplicacion(urlAdmin, urlAplicacion);
}

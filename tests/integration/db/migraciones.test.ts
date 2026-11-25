import { afterAll, describe, expect, it } from 'vitest';
import pg from 'pg';
import { urlTestMigraciones } from '../entorno.ts';

const admin = new pg.Pool({ connectionString: urlTestMigraciones(), max: 1 });

afterAll(async () => {
  await admin.end();
});

describe('migraciones', () => {
  it('instalan la extensión btree_gist', async () => {
    const { rows } = await admin.query<{ extname: string }>(
      "select extname from pg_extension where extname = 'btree_gist'",
    );
    expect(rows).toHaveLength(1);
  });

  it('crean las siete tablas del change', async () => {
    const { rows } = await admin.query<{ tablename: string }>(
      "select tablename from pg_tables where schemaname = 'public' order by tablename",
    );
    expect(rows.map((r) => r.tablename)).toEqual([
      'consultorio',
      'paciente',
      'prestacion',
      'prestacion_profesional',
      'profesional',
      'sillon',
      'turno',
    ]);
  });

  it('usan claves foráneas compuestas por consultorio en turno', async () => {
    const { rows } = await admin.query<{ conname: string }>(
      `select conname from pg_constraint
        where conrelid = 'turno'::regclass and contype = 'f' and array_length(conkey, 1) = 2
        order by conname`,
    );
    expect(rows.map((r) => r.conname)).toEqual([
      'turno_paciente_fk',
      'turno_prestacion_fk',
      'turno_profesional_fk',
      'turno_sillon_fk',
    ]);
  });
});

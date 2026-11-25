import { afterAll, describe, expect, it } from 'vitest';
import { crearFixtures } from './fixtures.ts';

const fixtures = crearFixtures();

afterAll(async () => {
  await fixtures.cerrar();
});

describe('fixtures de integración', () => {
  it('crean un consultorio ficticio completo con identificadores nuevos', async () => {
    const c = await fixtures.consultorio();
    expect(c.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(c.profesionales.ana).not.toBe(c.profesionales.luis);
    expect(c.sillones.box1).not.toBe(c.sillones.box2);
    expect(Object.keys(c.prestaciones).sort()).toEqual(['consultaBreve', 'extraccion', 'limpieza', 'tratamientoConducto']);
  });

  it('dos llamadas crean consultorios distintos, para que los tests no se pisen', async () => {
    const [a, b] = await Promise.all([fixtures.consultorio(), fixtures.consultorio()]);
    expect(a.id).not.toBe(b.id);
    expect(a.pacientes.principal).not.toBe(b.pacientes.principal);
  });
});

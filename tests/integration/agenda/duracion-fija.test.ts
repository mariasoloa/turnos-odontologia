import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { crearConexion } from '../../../src/shared/db/index.ts';
import { prestacion, turno } from '../../../src/shared/db/schema.ts';
import { crearTurno } from '../../../src/features/agenda/application/crear-turno.ts';
import { crearUnidadDeTrabajo } from '../../../src/features/agenda/infrastructure/repositorio-agenda.drizzle.ts';
import { crearFixtures } from '../fixtures.ts';
import { urlTestAplicacion, urlTestMigraciones } from '../entorno.ts';

// Spec: turnos, "Cambio posterior de duración" (RN-AG-04).

const fixtures = crearFixtures();
const admin = crearConexion(urlTestMigraciones(), { max: 1 });
const app = crearConexion(urlTestAplicacion(), { max: 2 });
const uow = crearUnidadDeTrabajo(app.db);

afterAll(async () => {
  await Promise.all([fixtures.cerrar(), admin.cerrar(), app.cerrar()]);
});

describe('duración fijada al crear el turno', () => {
  it('pasar la extracción de 45 a 60 minutos no cambia un turno existente de 9:00 a 9:45', async () => {
    const c = await fixtures.consultorio();
    const datos = {
      consultorioId: c.id,
      pacienteId: c.pacientes.principal,
      profesionalId: c.profesionales.ana,
      prestacionId: c.prestaciones.extraccion,
      sillonId: c.sillones.box1,
      inicioLocal: '2026-12-15T09:00',
    };
    const creado = await crearTurno({ uow }, datos);
    if (!creado.ok) throw new Error(`No se pudo crear el turno de prueba: ${creado.error.tipo}`);

    await admin.db.update(prestacion).set({ duracionMinutos: 60 }).where(eq(prestacion.id, c.prestaciones.extraccion));

    const [guardado] = await admin.db.select({ rango: turno.rango }).from(turno).where(eq(turno.id, creado.valor.id));
    expect(guardado?.rango).toEqual({ inicio: new Date('2026-12-15T12:00:00Z'), fin: new Date('2026-12-15T12:45:00Z') });

    // Un turno nuevo sí usa la duración actualizada.
    const nuevo = await crearTurno({ uow }, { ...datos, inicioLocal: '2026-12-15T11:00' });
    expect(nuevo.ok && nuevo.valor.fin).toEqual(new Date('2026-12-15T15:00:00Z'));
  });
});

import { describe, expect, it } from 'vitest';
import { horasEntre, localAUtc, utcALocal } from '../../../src/shared/time/index.ts';

const BUENOS_AIRES = 'America/Argentina/Buenos_Aires';

describe('localAUtc', () => {
  it('convierte las 10:00 de Buenos Aires a las 13:00 UTC', () => {
    expect(localAUtc('2026-12-01T10:00', BUENOS_AIRES).toISOString()).toBe('2026-12-01T13:00:00.000Z');
  });

  it('cruza de día cuando la hora local es cercana a la medianoche', () => {
    expect(localAUtc('2026-12-01T22:30', BUENOS_AIRES).toISOString()).toBe('2026-12-02T01:30:00.000Z');
  });

  it('respeta una zona con horario de verano (Madrid en julio, UTC+2)', () => {
    expect(localAUtc('2026-07-15T10:00', 'Europe/Madrid').toISOString()).toBe('2026-07-15T08:00:00.000Z');
  });

  it('rechaza un formato de fecha inválido', () => {
    expect(() => localAUtc('01/12/2026 10:00', BUENOS_AIRES)).toThrow('Fecha y hora local inválida');
  });

  it('rechaza una fecha inexistente', () => {
    expect(() => localAUtc('2026-02-30T10:00', BUENOS_AIRES)).toThrow('Fecha y hora local inválida');
  });
});

describe('utcALocal', () => {
  it('convierte las 13:00 UTC a las 10:00 de Buenos Aires', () => {
    expect(utcALocal(new Date('2026-12-01T13:00:00Z'), BUENOS_AIRES)).toBe('2026-12-01T10:00');
  });

  it('es la inversa de localAUtc', () => {
    expect(utcALocal(localAUtc('2026-12-31T23:45', BUENOS_AIRES), BUENOS_AIRES)).toBe('2026-12-31T23:45');
  });
});

describe('horasEntre', () => {
  const inicio = new Date('2026-12-02T13:00:00Z');

  it('da exactamente 24 horas entre dos instantes separados por un día', () => {
    expect(horasEntre(new Date('2026-12-01T13:00:00Z'), inicio)).toBe(24);
  });

  it('da menos de 24 horas cuando falta un minuto', () => {
    const resultado = horasEntre(new Date('2026-12-01T13:01:00Z'), inicio);
    expect(resultado).toBeLessThan(24);
    expect(resultado).toBeCloseTo(23 + 59 / 60, 10);
  });

  it('da un valor negativo cuando el segundo instante es anterior', () => {
    expect(horasEntre(inicio, new Date('2026-12-02T12:00:00Z'))).toBe(-1);
  });
});

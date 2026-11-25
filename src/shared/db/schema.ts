import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  customType,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/** Rango de tiempo `[inicio, fin)` guardado como `tstzrange`. */
export interface Rango {
  inicio: Date;
  fin: Date;
}

function aFecha(valor: string): Date {
  // PostgreSQL devuelve `2026-12-01 13:00:00+00`; se normaliza a ISO 8601.
  const iso = valor.replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00');
  return new Date(iso);
}

export const tstzrange = customType<{ data: Rango; driverData: string }>({
  dataType() {
    return 'tstzrange';
  },
  toDriver(rango) {
    return `[${rango.inicio.toISOString()},${rango.fin.toISOString()})`;
  },
  fromDriver(valor) {
    const [inicio = '', fin = ''] = valor.slice(1, -1).split(',').map((s) => s.replaceAll('"', ''));
    return { inicio: aFecha(inicio), fin: aFecha(fin) };
  },
});

const auditoria = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
};

export const estadoConsultorio = pgEnum('estado_consultorio', ['activo', 'suspendido']);
export const estadoTurno = pgEnum('estado_turno', ['reservado', 'atendido', 'ausente', 'cancelado', 'cancelado_tarde']);
export const origenTurno = pgEnum('origen_turno', ['online', 'personal']);
export const canceladoPor = pgEnum('cancelado_por', ['paciente', 'personal']);

export const consultorio = pgTable('consultorio', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  slug: text('slug').notNull().unique(),
  direccion: text('direccion'),
  telefono: text('telefono'),
  emailContacto: text('email_contacto'),
  estado: estadoConsultorio('estado').notNull().default('activo'),
  maxAusenciasBloqueo: integer('max_ausencias_bloqueo').notNull().default(3),
  granularidadMinutos: integer('granularidad_minutos').notNull().default(15),
  anticipacionMinimaHoras: integer('anticipacion_minima_horas').notNull().default(2),
  horizonteReservaDias: integer('horizonte_reserva_dias').notNull().default(60),
  zonaHoraria: text('zona_horaria').notNull().default('America/Argentina/Buenos_Aires'),
  ...auditoria,
});

export const profesional = pgTable(
  'profesional',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => consultorio.id),
    nombre: text('nombre').notNull(),
    especialidad: text('especialidad'),
    // Se vincula con la tabla de usuarios cuando exista el acceso del personal (fuera de este change).
    userId: uuid('user_id'),
    activo: boolean('activo').notNull().default(true),
    visibleOnline: boolean('visible_online').notNull().default(true),
    orden: integer('orden').notNull().default(0),
    ...auditoria,
  },
  (t) => [unique('profesional_tenant_id_id_unico').on(t.tenantId, t.id)],
);

export const sillon = pgTable(
  'sillon',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => consultorio.id),
    nombre: text('nombre').notNull(),
    activo: boolean('activo').notNull().default(true),
    ...auditoria,
  },
  (t) => [unique('sillon_tenant_id_id_unico').on(t.tenantId, t.id)],
);

export const prestacion = pgTable(
  'prestacion',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => consultorio.id),
    nombre: text('nombre').notNull(),
    duracionMinutos: integer('duracion_minutos').notNull(),
    requiereSillon: boolean('requiere_sillon').notNull().default(true),
    reservableOnline: boolean('reservable_online').notNull().default(true),
    activa: boolean('activa').notNull().default(true),
    ...auditoria,
  },
  (t) => [
    unique('prestacion_tenant_id_id_unico').on(t.tenantId, t.id),
    check('prestacion_duracion_valida', sql`${t.duracionMinutos} between 5 and 480`),
  ],
);

export const prestacionProfesional = pgTable(
  'prestacion_profesional',
  {
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => consultorio.id),
    prestacionId: uuid('prestacion_id').notNull(),
    profesionalId: uuid('profesional_id').notNull(),
  },
  (t) => [
    primaryKey({ name: 'prestacion_profesional_pk', columns: [t.prestacionId, t.profesionalId] }),
    foreignKey({
      name: 'prestacion_profesional_prestacion_fk',
      columns: [t.tenantId, t.prestacionId],
      foreignColumns: [prestacion.tenantId, prestacion.id],
    }),
    foreignKey({
      name: 'prestacion_profesional_profesional_fk',
      columns: [t.tenantId, t.profesionalId],
      foreignColumns: [profesional.tenantId, profesional.id],
    }),
  ],
);

export const paciente = pgTable(
  'paciente',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => consultorio.id),
    nombre: text('nombre').notNull(),
    apellido: text('apellido').notNull(),
    dni: text('dni'),
    email: text('email'),
    telefono: text('telefono'),
    obraSocial: text('obra_social'),
    nroAfiliado: text('nro_afiliado'),
    notasAdministrativas: text('notas_administrativas'),
    ausenciasSinAviso: integer('ausencias_sin_aviso').notNull().default(0),
    bloqueadoOnline: boolean('bloqueado_online').notNull().default(false),
    bloqueadoEn: timestamp('bloqueado_en', { withTimezone: true }),
    consentimientoAceptadoEn: timestamp('consentimiento_aceptado_en', { withTimezone: true }),
    consentimientoVersion: text('consentimiento_version'),
    anonimizadoEn: timestamp('anonimizado_en', { withTimezone: true }),
    ...auditoria,
  },
  (t) => [
    unique('paciente_tenant_id_id_unico').on(t.tenantId, t.id),
    uniqueIndex('paciente_tenant_dni_unico')
      .on(t.tenantId, t.dni)
      .where(sql`${t.dni} is not null`),
    check('paciente_dni_solo_digitos', sql`${t.dni} is null or ${t.dni} ~ '^[0-9]+$'`),
    check('paciente_notas_largo', sql`char_length(${t.notasAdministrativas}) <= 500`),
  ],
);

export const turno = pgTable(
  'turno',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => consultorio.id),
    pacienteId: uuid('paciente_id').notNull(),
    profesionalId: uuid('profesional_id').notNull(),
    sillonId: uuid('sillon_id'),
    prestacionId: uuid('prestacion_id').notNull(),
    rango: tstzrange('rango').notNull(),
    estado: estadoTurno('estado').notNull().default('reservado'),
    origen: origenTurno('origen').notNull(),
    canceladoEn: timestamp('cancelado_en', { withTimezone: true }),
    canceladoPor: canceladoPor('cancelado_por'),
    motivoCancelacion: text('motivo_cancelacion'),
    emailContacto: text('email_contacto'),
    requiereVerificacion: boolean('requiere_verificacion').notNull().default(false),
    ...auditoria,
  },
  (t) => [
    foreignKey({
      name: 'turno_paciente_fk',
      columns: [t.tenantId, t.pacienteId],
      foreignColumns: [paciente.tenantId, paciente.id],
    }),
    foreignKey({
      name: 'turno_profesional_fk',
      columns: [t.tenantId, t.profesionalId],
      foreignColumns: [profesional.tenantId, profesional.id],
    }),
    foreignKey({
      name: 'turno_sillon_fk',
      columns: [t.tenantId, t.sillonId],
      foreignColumns: [sillon.tenantId, sillon.id],
    }),
    foreignKey({
      name: 'turno_prestacion_fk',
      columns: [t.tenantId, t.prestacionId],
      foreignColumns: [prestacion.tenantId, prestacion.id],
    }),
    check(
      'turno_rango_valido',
      sql`not isempty(${t.rango}) and lower_inc(${t.rango}) and not upper_inc(${t.rango}) and not lower_inf(${t.rango}) and not upper_inf(${t.rango})`,
    ),
    check(
      'turno_cancelacion_coherente',
      sql`(${t.estado} in ('cancelado', 'cancelado_tarde')) = (${t.canceladoEn} is not null and ${t.canceladoPor} is not null)`,
    ),
    index('turno_tenant_profesional_rango_idx').on(t.tenantId, t.profesionalId, t.rango),
    index('turno_tenant_paciente_idx').on(t.tenantId, t.pacienteId),
    index('turno_tenant_estado_rango_idx').on(t.tenantId, t.estado, t.rango),
  ],
);

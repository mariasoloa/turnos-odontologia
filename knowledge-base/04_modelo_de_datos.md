# Modelo de Datos

Convenciones:
- Claves primarias `uuid` (v7 o `gen_random_uuid()`).
- Timestamps en `timestamptz` (UTC en la base); se muestran en `America/Argentina/Buenos_Aires`.
- Toda tabla de dominio lleva `tenant_id uuid not null` (referencia a `consultorio.id`) y tiene **RLS activada** con la política `tenant_id = current_setting('app.tenant_id')::uuid`.
- Columnas de auditoría `created_at` y `updated_at`.

## Dominios

| Dominio | Entidades | Descripción |
|---|---|---|
| Identidad y acceso | `user`, `session`, `account`, `verification`, `two_factor` (Better Auth), `miembro_consultorio`, `invitacion` | Personal y sus roles por consultorio |
| Consultorio | `consultorio` | Tenant y sus reglas configurables |
| Recursos | `profesional`, `sillon`, `prestacion`, `prestacion_profesional` | Qué se ofrece y con qué recursos |
| Disponibilidad | `horario_atencion`, `bloqueo` | Cuándo atiende cada profesional y cuándo no |
| Pacientes | `paciente` | Ficha básica, identificada por DNI dentro del consultorio |
| Turnos | `turno`, `token_turno` | Reservas y sus estados |
| Notificaciones | `notificacion` | Outbox de avisos por canal |
| Auditoría | `registro_auditoria` | Registro inalterable de accesos y cambios sensibles |

## ERD

```
consultorio 1───* miembro_consultorio *───1 user
     │ 1                                    │ 0..1
     ├──* profesional ──────────────────────┘ (user_id opcional)
     │        │ 1        * prestacion_profesional *  1 prestacion ─┐
     │        ├──* horario_atencion                                 │
     │        └──* bloqueo (profesional_id | sillon_id | ambos null)│
     ├──* sillon                                                    │
     ├──* paciente 1───* turno *───1 prestacion ◄───────────────────┘
     │                    │  *───1 profesional
     │                    │  *───0..1 sillon
     │                    ├──* token_turno
     │                    └──* notificacion
     └──* registro_auditoria
```

## Entidades

### consultorio (tenant)
- `id uuid PK`, `nombre text not null`, `slug text not null unique` (minúsculas, guiones), `direccion text`, `telefono text`, `email_contacto text`
- `estado enum('activo','suspendido') not null default 'activo'`
- `max_ausencias_bloqueo int not null default 3` (0 = sin bloqueo)
- `granularidad_minutos int not null default 15` (inicio de los slots ofrecidos online)
- `anticipacion_minima_horas int not null default 2` (no se reserva online con menos anticipación) _(supuesto)_
- `horizonte_reserva_dias int not null default 60`
- `zona_horaria text not null default 'America/Argentina/Buenos_Aires'`
- **No tiene RLS por `tenant_id`**: se lee por slug en rutas públicas mediante una vista o función acotada.

### miembro_consultorio
- `id`, `tenant_id FK`, `user_id FK → user.id`, `roles text[] not null` ⊂ {`admin`,`recepcion`,`odontologo`}, `activo boolean`
- Unique (`tenant_id`, `user_id`). Al menos un `admin` activo por consultorio (lo controla la aplicación).

### invitacion
- `id`, `tenant_id`, `email`, `roles text[]`, `token_hash text unique`, `expira_en timestamptz`, `aceptada_en timestamptz null`

### profesional
- `id`, `tenant_id`, `nombre text`, `especialidad text null`, `user_id uuid null FK`, `activo boolean`, `visible_online boolean default true`, `orden int`

### sillon
- `id`, `tenant_id`, `nombre text` (por ejemplo "Box 1"), `activo boolean`

### prestacion
- `id`, `tenant_id`, `nombre text`, `duracion_minutos int not null check (duracion_minutos between 5 and 480)`
- `requiere_sillon boolean not null default true`
- `reservable_online boolean not null default true`, `activa boolean`

### prestacion_profesional
- (`prestacion_id`, `profesional_id`) PK, `tenant_id`. Indica qué profesionales realizan cada prestación.

### horario_atencion
- `id`, `tenant_id`, `profesional_id FK`, `dia_semana smallint check (0..6)`, `hora_inicio time`, `hora_fin time check (hora_fin > hora_inicio)`, `vigente_desde date null`, `vigente_hasta date null`

### bloqueo
- `id`, `tenant_id`, `profesional_id uuid null`, `sillon_id uuid null`, `rango tstzrange not null`, `motivo text`
- Si `profesional_id` y `sillon_id` son ambos null, el bloqueo es de todo el consultorio (feriado, cierre).

### paciente
- `id`, `tenant_id`, `nombre text`, `apellido text`, `dni text null`, `email text null`, `telefono text null`, `obra_social text null`, `nro_afiliado text null`, `notas_administrativas text null` (máximo 500 caracteres, sin datos clínicos, RN-PR-03)
- `ausencias_sin_aviso int not null default 0`, `bloqueado_online boolean not null default false`, `bloqueado_en timestamptz null`
- `consentimiento_aceptado_en timestamptz null`, `consentimiento_version text null`
- `anonimizado_en timestamptz null`
- Unique parcial (`tenant_id`, `dni`) `where dni is not null`. Se normaliza el DNI: solo dígitos.

### turno
- `id`, `tenant_id`, `paciente_id FK`, `profesional_id FK`, `sillon_id uuid null FK`, `prestacion_id FK`
- `rango tstzrange not null` (inicio inclusivo, fin exclusivo; fin = inicio + duración de la prestación al momento de reservar)
- `estado enum('reservado','atendido','ausente','cancelado','cancelado_tarde') not null default 'reservado'`
- `origen enum('online','personal') not null`
- `cancelado_en timestamptz null`, `cancelado_por enum('paciente','personal') null`, `motivo_cancelacion text null`
- `email_contacto text null` (email ingresado en esta reserva; puede diferir del de la ficha)
- `requiere_verificacion boolean default false` (el email no coincide con la ficha, RN-PA-03)
- **Restricciones de exclusión** (requieren `btree_gist`):
  ```sql
  EXCLUDE USING gist (tenant_id WITH =, profesional_id WITH =, rango WITH &&)
    WHERE (estado IN ('reservado','atendido','ausente'));
  EXCLUDE USING gist (tenant_id WITH =, sillon_id WITH =, rango WITH &&)
    WHERE (sillon_id IS NOT NULL AND estado IN ('reservado','atendido','ausente'));
  ```
- Check: si la prestación requiere sillón, `sillon_id` no es null (lo valida la aplicación, porque depende de otra tabla).
- Índices: (`tenant_id`, `profesional_id`, `rango`), (`tenant_id`, `paciente_id`), (`tenant_id`, `estado`, `rango`).

### token_turno
- `id`, `tenant_id`, `turno_id FK`, `token_hash text unique` (SHA-256 del token; el token en claro solo viaja en el email), `proposito enum('gestionar')`, `expira_en timestamptz` (= inicio del turno), `usado_en timestamptz null`

### notificacion (outbox)
- `id`, `tenant_id`, `turno_id uuid null`, `tipo enum('confirmacion','recordatorio','cancelacion','cancelacion_tarde')`
- `canal enum('email','whatsapp')` (en el MVP solo `email`), `destinatario text`
- `programada_para timestamptz not null`, `estado enum('pendiente','enviando','enviada','fallida','descartada')`
- `intentos int default 0`, `ultimo_error text null`, `enviada_en timestamptz null`, `id_proveedor text null`
- Unique (`turno_id`, `tipo`, `canal`): garantiza la idempotencia.
- Índice (`estado`, `programada_para`).

### registro_auditoria
- `id bigserial`, `tenant_id`, `actor_user_id uuid null`, `actor_tipo enum('personal','paciente','sistema','plataforma')`, `accion text` (por ejemplo `paciente.ver`, `turno.cancelar`, `paciente.anonimizar`), `entidad text`, `entidad_id uuid`, `metadatos jsonb` (**sin datos personales**), `ip inet null`, `created_at`
- El rol de la aplicación tiene solo `INSERT` y `SELECT`: sin `UPDATE` ni `DELETE`.

## Seed data inicial

**Producción:** no hay datos precargados. Cada consultorio se crea con `pnpm tenant:create --nombre --slug --admin-email`, que crea el consultorio y envía la invitación al primer administrador.

**Desarrollo y tests** (`pnpm db:seed`), con datos ficticios:
- Consultorio "Consultorio Demo" (`demo`), con granularidad de 15 minutos y bloqueo a las 3 ausencias.
- Profesionales: "Dra. Ana Demo" (odontología general) y "Dr. Luis Demo" (endodoncia).
- Sillones: "Box 1" y "Box 2".
- Prestaciones:

  | Prestación | Duración | Usa sillón |
  |---|---|---|
  | Consulta breve | 15 min | No |
  | Limpieza | 30 min | Sí |
  | Extracción | 45 min | Sí |
  | Tratamiento de conducto | 60 min | Sí |

- Horarios: lunes a viernes, de 9:00 a 13:00 y de 15:00 a 19:00.
- Usuarios: `admin@demo.test`, `recepcion@demo.test` y `odontologo@demo.test`, con contraseña de desarrollo (nunca en producción).
- Cinco pacientes ficticios, uno de ellos bloqueado.

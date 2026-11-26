# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **turnos-odontologia**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de empezar un item.**
>
> Notas del proyecto:
> - La fase de diseño visual se salteó a pedido del equipo (24/11/2026). Los changes con UI no tienen una compuerta de mockups; usan componentes simples y responsive (390 px y 1440 px).
> - Los campos del modo equipo (`Resultado`, `Zona`, `Requiere`, `Modo`, `Responsable`) se agregan en la fase `team-mode` de la fundación.

---

## Cómo usar este documento

1. Identificar el item a implementar y verificar que sus dependencias figuran completas (`[x]`) en este roadmap.
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Acordar el alcance y los criterios de aceptación del item (las historias US-NNN y las reglas RN-XX-NN que cita).
4. Implementar, verificar los criterios acordados (tests unitarios, de integración y E2E según el Scope) y registrar la evidencia.
5. Marcar el checkbox `[x]` en este archivo al completar la verificación técnica.

Conservá los IDs de las fichas al editar o reordenar. Si el proyecto usa ClickUp,
este roadmap conserva el alcance y las dependencias. Consultá el responsable y el estado operativo
en ClickUp y el último dato confirmado en `.active-stack/roadmap-state.json`.

---

## Árbol de dependencias

```
C-01 project-scaffolding
  └── C-02 database-foundation
        └── C-03 staff-auth                         ← desbloquea todo el panel
              │
              ├── C-04 platform-tenant-scripts
              ├── C-05 team-management
              │
              └── C-06 clinic-resources
                    └── C-07 schedules-and-settings
                          └── C-08 appointments-core      ← núcleo: EXCLUDE + estados
                                │
                                ├── C-09 availability-engine
                                │     ├── C-11 staff-agenda
                                │     └── C-14 public-booking ← + C-13
                                │
                                ├── C-10 patient-records
                                │     └── C-16 privacy-compliance ← + C-13
                                │
                                ├── C-12 attendance-and-no-shows
                                │
                                └── C-13 notifications-outbox
                                      ├── C-14 public-booking
                                      ├── C-15 patient-cancel-link
                                      └── C-16 privacy-compliance

C-04 + C-05 + C-11 + C-12 + C-14 + C-15 + C-16
  └── C-17 production-readiness                      ← fin del MVP
        └── C-18 whatsapp-channel                    ← post-MVP (prioridad 1)
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 project-scaffolding             (solo)

GATE 1: C-01 ✓
  → C-02 database-foundation             (solo)

GATE 2: C-02 ✓
  → C-03 staff-auth                      (solo)

GATE 3: C-03 ✓                           ← FORK (3 paralelos)
  → C-06 clinic-resources                [Agente A]
  → C-04 platform-tenant-scripts         [Agente B]
  → C-05 team-management                 [Agente C]

GATE 4: C-06 ✓
  → C-07 schedules-and-settings          [Agente A]

GATE 5: C-07 ✓
  → C-08 appointments-core               [Agente A]

GATE 6: C-08 ✓                           ← FORK (4 paralelos)
  → C-09 availability-engine             [Agente A]
  → C-13 notifications-outbox            [Agente B]
  → C-10 patient-records                 [Agente C]
  → C-12 attendance-and-no-shows         [Agente C — después de C-10]

GATE 7: C-09 ✓ / C-13 ✓
  → C-14 public-booking                  [Agente A — si C-09 ✓ y C-13 ✓]
  → C-15 patient-cancel-link             [Agente B — si C-13 ✓]
  → C-11 staff-agenda                    [Agente C — si C-09 ✓]

GATE 8: C-10 ✓ + C-13 ✓
  → C-16 privacy-compliance              [Agente B]

GATE 9: C-04, C-05, C-11, C-12, C-14, C-15, C-16 ✓
  → C-17 production-readiness            (solo)

GATE 10: C-17 ✓                          ← post-MVP
  → C-18 whatsapp-channel                [Agente B]
```

### Camino crítico (9 changes — mínimo irreducible)

```
C-01 → C-02 → C-03 → C-06 → C-07 → C-08 → C-09 → C-14 → C-17
```

`C-13 notifications-outbox` corre en paralelo con `C-09` y tiene la misma longitud: si se atrasa, pasa a formar parte del camino crítico porque `C-14` depende de ambos.

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Backend Core)      │ Agente B (Backend Aux)        │ Agente C (Frontend)
─────┼──────────────────────────────┼───────────────────────────────┼──────────────────────────────
  1  │ C-01 project-scaffolding     │            —                  │            —
  2  │ C-02 database-foundation     │            —                  │            —
  3  │ C-03 staff-auth              │            —                  │            —
  4  │ C-06 clinic-resources        │ C-04 platform-tenant-scripts  │ C-05 team-management
  5  │ C-07 schedules-and-settings  │            —                  │            —
  6  │ C-08 appointments-core       │            —                  │            —
  7  │ C-09 availability-engine     │ C-13 notifications-outbox     │ C-10 patient-records
  8  │ C-14 public-booking          │ C-15 patient-cancel-link      │ C-11 staff-agenda
  9  │            —                 │ C-16 privacy-compliance       │ C-12 attendance-and-no-shows
 10  │ C-17 production-readiness    │            —                  │            —
 11  │            —                 │ C-18 whatsapp-channel (post-MVP) │         —
```

---

## FASE 0 — Cimientos

### [C-01] `project-scaffolding`
- **Estado**: `[ ]` pendiente
- **Avance parcial** (change OpenSpec `turnos-sin-solapamiento`, archivado el 25/11/2026, commit `a0235e2`): ya existen TypeScript `strict` + pnpm + ESLint, `src/shared/time/` con tests (RN-GL-01), Vitest (unit e integración), `.env.example`/`.gitignore` y un workflow de GitHub Actions (typecheck, lint, tests; verificado en la corrida #1 del 25/11/2026, commit `0ac76f1`). Falta: Next.js, Tailwind, Prettier, `/api/health`, Playwright, build en CI y cabeceras de seguridad.
- **Scope**: Proyecto Next.js base con calidad automatizada desde el día uno
  - Next.js (App Router) + TypeScript `strict` + pnpm + Tailwind CSS; ESLint y Prettier
  - Estructura de `src/app`, `src/features`, `src/shared`, `db/`, `scripts/` y `tests/` según la KB
  - `src/shared/time/`: utilidades de zona horaria (`America/Argentina/Buenos_Aires`) con tests unitarios (RN-GL-01)
  - `GET /api/health` (devuelve versión y estado)
  - Vitest configurado (unit) y Playwright configurado (proyectos 390×844 y 1440×900)
  - GitHub Actions: lint, typecheck, tests unitarios y build en cada push y pull request
  - `.env.example` con todas las variables de la KB, sin valores reales; `.gitignore` con `.env*`
  - Cabeceras de seguridad base en `next.config` (CSP inicial, `X-Frame-Options`, HSTS, `Referrer-Policy`)
  - Tests: smoke de `/api/health`, unit de utilidades de tiempo
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md`
  - `knowledge-base/02_descripcion_general.md` §Stack tecnológico
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios, §Estrategia de testing, §Variables de entorno

---

### [C-02] `database-foundation`
- **Estado**: `[ ]` pendiente
- **Avance parcial** (`turnos-sin-solapamiento`, 25/11/2026): Drizzle y drizzle-kit, migraciones `0000`–`0003` (`btree_gist`, `consultorio`, rol `app_user` sin `BYPASSRLS` y rol de migraciones separado, RLS forzado con `nullif(current_setting(...))`), `withTenant`, `pnpm db:migrate`/`db:seed` con el consultorio Demo y job de CI con PostgreSQL. Desvío: PostgreSQL local en Windows en lugar de Supabase CLI (design D8). Falta: `pgcrypto`, `registro_auditoria` y `features/auditoria`, lectura pública de consultorio por slug y `pnpm db:reset`.
- **Scope**: Base de datos, multi-tenancy con RLS y auditoría
  - Supabase CLI para PostgreSQL local; Drizzle ORM y drizzle-kit configurados
  - Migración 0001: extensiones `btree_gist`, `pgcrypto`; rol `app_user` **sin** `BYPASSRLS`; rol de migraciones separado
  - Migración 0001: tabla `consultorio` (estado, reglas configurables, slug único) y `registro_auditoria` (solo `INSERT`/`SELECT` para `app_user`)
  - `src/shared/db/`: cliente Drizzle (pooler) y `withTenant(tenantId, fn)` con `set_config('app.tenant_id', id, true)`
  - Plantilla de política RLS reutilizable (`tenant_id = current_setting('app.tenant_id')::uuid`) y función de lectura pública de consultorio por slug
  - `features/auditoria`: `registrarAuditoria()` sin datos personales (RN-PR-05)
  - `db/seed.ts` inicial (consultorio Demo) y `pnpm db:migrate`, `pnpm db:seed`, `pnpm db:reset`
  - CI: job de integración que levanta PostgreSQL y aplica migraciones
  - Tests de integración: `app_user` no puede `UPDATE`/`DELETE` la auditoría; sin `app.tenant_id` no se ven filas
- **Dependencias**: C-01
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Convenciones, §consultorio, §registro_auditoria
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones aplicados, §Seguridad
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-03, §DD-05, §DD-06
  - `knowledge-base/12_privacidad_y_cumplimiento.md` §Requisitos de producto

---

## FASE 1 — Identidad y acceso

### [C-03] `staff-auth`
- **Estado**: `[ ]` pendiente
- **Scope**: Acceso del personal con roles por consultorio y 2FA de administrador
  - Better Auth: email y contraseña, verificación de email, recuperación de clave, contraseña ≥ 10 caracteres con control de contraseñas filtradas
  - Plugin `twoFactor` (TOTP + códigos de respaldo); **obligatorio para `admin`**: hasta activarlo solo accede a `/panel/seguridad/2fa` (RN-SE-02)
  - Migración 0002: tablas de Better Auth + `miembro_consultorio` (roles `text[]`) + `invitacion` (token hasheado, vence en 72 h)
  - Bloqueo temporal tras 5 intentos fallidos (RN-SE-06); cookie `HttpOnly`/`Secure`/`SameSite=Lax`
  - Selector de consultorio activo en la sesión; guard `requireRole([...])` y `requireTenant()` que envuelven `withTenant` (RN-SE-03)
  - Consultorio `suspendido` → acceso al panel bloqueado (RN-SE-07)
  - `src/shared/email/`: adaptador mínimo de Resend para los emails de autenticación (lo reutiliza C-13)
  - Páginas: `/login`, `/recuperar-clave`, `/restablecer-clave`, `/aceptar-invitacion/[token]`, layout base de `/panel`
  - Tests: login correcto o incorrecto, bloqueo por intentos, 2FA forzado para admin, invitación vencida o usada, aislamiento entre dos consultorios del mismo usuario; E2E login con 2FA
- **Dependencias**: C-02
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md`
  - `knowledge-base/05_reglas_de_negocio.md` §Seguridad y acceso (RN-SE)
  - `knowledge-base/06_funcionalidades.md` §Épica 2 (US-010, US-011)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04

---

### [C-04] `platform-tenant-scripts`
- **Estado**: `[ ]` pendiente
- **Scope**: Operación de la plataforma por scripts internos
  - `scripts/tenant-create.ts` → `pnpm tenant:create --nombre --slug --admin-email`: crea `consultorio` + `invitacion(admin)` en una transacción y envía el email de invitación
  - `scripts/tenant-suspend.ts` y `scripts/tenant-reactivate.ts` (`--slug`)
  - Usan `DATABASE_URL_DIRECT` (rol de migraciones); auditoría con `actor_tipo = 'plataforma'` (RN-GL-04)
  - Validación de slug (minúsculas, guiones, único) y de email; mensajes de error claros; código de salida distinto de 0 si falla
  - Tests de integración: alta completa, slug duplicado sin datos parciales, suspensión bloquea panel y reserva
- **Dependencias**: C-03
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (US-001, US-002)
  - `knowledge-base/07_flujos_principales.md` §Flujo 5
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-10
  - `knowledge-base/05_reglas_de_negocio.md` §RN-GL-04, §RN-SE-07

---

### [C-05] `team-management`
- **Estado**: `[ ]` pendiente
- **Scope**: Gestión del equipo del consultorio por el administrador
  - Página `/panel/equipo`: listar miembros, invitar (email + roles), cambiar roles, desactivar
  - Server Actions con `requireRole(['admin'])`; regla: siempre al menos un `admin` activo
  - Desactivar un miembro invalida sus sesiones en ese consultorio
  - Invitación a un email existente agrega membresía sin crear otra cuenta
  - Auditoría de cada cambio de rol o desactivación
  - Tests: no se puede quitar el último admin; recepción u odontólogo no acceden; E2E invitar y aceptar
- **Dependencias**: C-03
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §RBAC
  - `knowledge-base/06_funcionalidades.md` §US-012
  - `knowledge-base/05_reglas_de_negocio.md` §RN-SE

---

## FASE 2 — Configuración del consultorio

### [C-06] `clinic-resources`
- **Estado**: `[ ]` pendiente
- **Avance parcial** (`turnos-sin-solapamiento`, 25/11/2026): las tablas `profesional`, `sillon`, `prestacion` y `prestacion_profesional` ya existen (migración `0001`, con RLS en `0003` y FK compuestas por consultorio), y el seed carga los recursos de la KB. Falta: páginas CRUD, permisos por rol y aviso IN-02.
- **Scope**: Profesionales, sillones y prestaciones
  - Migración 0003: `profesional`, `sillon`, `prestacion` (duración 5–480, `requiere_sillon`, `reservable_online`), `prestacion_profesional`, todas con `tenant_id` + RLS
  - Páginas `/panel/configuracion/profesionales`, `/sillones` y `/prestaciones`, con CRUD solo para admin y lectura para el resto
  - Vincular profesional con usuario (opcional) y marcar `visible_online`
  - Desactivación en lugar de borrado; aviso al desactivar `requiere_sillon` (IN-02)
  - Seed: 2 profesionales, 2 sillones y 4 prestaciones de la KB
  - Tests: validaciones Zod, RLS entre consultorios, permisos por rol
- **Dependencias**: C-03
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §profesional, §sillon, §prestacion, §prestacion_profesional
  - `knowledge-base/06_funcionalidades.md` §US-020, §US-021, §US-022
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-03, §RN-AG-04, §RN-AG-07, §RN-RE-01

---

### [C-07] `schedules-and-settings`
- **Estado**: `[ ]` pendiente
- **Scope**: Horarios, bloqueos y reglas configurables del consultorio
  - Migración 0004: `horario_atencion` (día, rango horario, vigencia) y `bloqueo` (`tstzrange`; profesional, sillón o todo el consultorio)
  - Páginas: horario semanal por profesional; bloqueos con listado de turnos afectados (vacío hasta C-08)
  - `/panel/configuracion/consultorio`: `max_ausencias_bloqueo`, `granularidad_minutos`, `anticipacion_minima_horas`, `horizonte_reserva_dias`, datos de contacto
  - Dominio: `horariosEfectivos(profesional, fecha)` (horario menos bloqueos) como función pura
  - Tests unitarios: horarios con vigencia, bloqueos de consultorio, cruce de medianoche no permitido; integración: RLS
- **Dependencias**: C-06
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §horario_atencion, §bloqueo, §consultorio
  - `knowledge-base/06_funcionalidades.md` §US-023, §US-024
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-05, §RN-RE-02, §RN-RE-03

---

## FASE 3 — Núcleo de agenda y turnos

> C-09, C-10, C-12 y C-13 se pueden trabajar en paralelo una vez completado C-08.

### [C-08] `appointments-core`
- **Estado**: `[ ]` pendiente
- **Avance parcial** (`turnos-sin-solapamiento`, 25/11/2026; specs en `openspec/specs/turnos` y `openspec/specs/aislamiento-consultorios`): `paciente` y `turno` (migración `0001`), restricciones `EXCLUDE` (migración `0004`), `crearTurno` y `cancelarTurno` con mapeo de 23P01 y reintento ante deadlock, regla de 24 h y tests de concurrencia. Falta: `token_turno` y tokens SHA-256, `moverTurno`, validación de horarios y bloqueos (RN-AG-05/06, requiere C-07), estados `atendido`/`ausente` y normalización de DNI.
- **Scope**: Pacientes y turnos con no solapamiento garantizado por la base de datos
  - Migración 0005: `paciente` (unique parcial `tenant_id`+`dni`, contador de ausencias, bloqueo, consentimiento, `anonimizado_en`), `turno` (`tstzrange`, estados, origen), `token_turno` (hash, vencimiento)
  - **Restricciones `EXCLUDE USING gist`** para profesional y para sillón sobre estados activos (RN-AG-01, RN-AG-02)
  - Dominio: máquina de estados del turno (`reservado` → `atendido`/`ausente`/`cancelado`/`cancelado_tarde`), regla de 24 h (RN-CA-02), normalización de DNI
  - Casos de uso (`application/`): `crearTurno`, `moverTurno`, `cancelarTurno` con validación de horario y bloqueos (RN-AG-05/06/07) y mapeo del error 23P01 a un error de dominio
  - Generación de tokens de 256 bits y almacenamiento SHA-256 (RN-SE-04)
  - Tests de integración: **dos reservas concurrentes sobre el mismo profesional o sillón → solo una gana**; cancelar libera el recurso; RLS
- **Dependencias**: C-07
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §paciente, §turno, §token_turno
  - `knowledge-base/05_reglas_de_negocio.md` §Agenda (RN-AG), §Cancelaciones y ausencias (RN-CA), §Pacientes (RN-PA)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-07
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (paso 6)

---

### [C-09] `availability-engine`
- **Estado**: `[ ]` pendiente
- **Scope**: Cálculo de disponibilidad y asignación de recursos
  - Dominio puro: `calcularDisponibilidad(consultorio, prestación, profesional | "cualquiera", fecha)` con granularidad, anticipación mínima y horizonte (RN-RE-02/03)
  - Exigir sillón libre durante toda la duración si la prestación lo requiere
  - `asignarProfesional` (menos turnos del día; empate por `orden`, RN-RE-04) y `asignarSillon` (primer libre por nombre, RN-RE-05)
  - Adaptador de consulta (`infrastructure/`) que trae horarios, bloqueos y turnos activos de un día en una sola ida a la base
  - Tests unitarios exhaustivos (≥ 90 % de cobertura): bordes de horario, bloqueos parciales, prestaciones sin sillón, sillones saturados, zona horaria
- **Dependencias**: C-08
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Reserva online (RN-RE)
  - `knowledge-base/07_flujos_principales.md` §Flujo 1 (paso 4)
  - `knowledge-base/09_decisiones_y_supuestos.md` §SU-03, §SU-04, §SU-05
  - `knowledge-base/04_modelo_de_datos.md` §horario_atencion, §bloqueo, §turno

---

### [C-10] `patient-records`
- **Estado**: `[ ]` pendiente
- **Scope**: Ficha básica del paciente en el panel
  - `/panel/pacientes`: búsqueda por nombre, apellido o DNI; alta y edición (admin y recepción)
  - Ficha con historial de turnos, ausencias y estado de bloqueo; botón "Desbloquear" (RN-CA-07)
  - Campo `notas_administrativas` (≤ 500) con advertencia de no cargar datos clínicos (RN-PR-03)
  - Odontólogo: solo lectura y solo pacientes con turnos con él
  - Auditoría `paciente.ver` en cada apertura de ficha (RN-PR-04)
  - Teléfono validado y guardado en E.164 (previsión para WhatsApp)
  - Tests: permisos por rol (el odontólogo no ve pacientes ajenos), auditoría de lectura, desbloqueo pone el contador en 0
- **Dependencias**: C-08
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 5 (US-040, US-041)
  - `knowledge-base/03_actores_y_roles.md` §RBAC
  - `knowledge-base/05_reglas_de_negocio.md` §Pacientes (RN-PA), §Privacidad (RN-PR)
  - `knowledge-base/12_privacidad_y_cumplimiento.md` §Requisitos de producto

---

### [C-11] `staff-agenda`
- **Estado**: `[ ]` pendiente
- **Scope**: Agenda del personal: ver, crear, mover y cancelar turnos
  - `/panel/agenda`: vista diaria y semanal, por profesional (columnas) y por sillón; en celular, una columna con selector de profesional
  - Muestra estado, prestación, paciente, origen y la alerta `requiere_verificacion`
  - Diálogo de nuevo turno: paciente (buscar o crear), prestación, profesional, horario sugerido por C-09, sillón propuesto y editable
  - Sobreturno fuera de horario con confirmación explícita (RN-AG-06); conflictos de solapamiento visibles y sin guardar
  - Mover y cancelar desde el panel (`cancelado_por = 'personal'`, regla de 24 h opcional)
  - Odontólogo ve por defecto solo su agenda
  - Tests E2E: crear, mover y cancelar turno; intento de solapamiento rechazado; vista móvil 390 px
- **Dependencias**: C-09
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §Épica 4 (US-030, US-031, US-032)
  - `knowledge-base/05_reglas_de_negocio.md` §Agenda (RN-AG)
  - `knowledge-base/03_actores_y_roles.md` §RBAC (turnos)
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios

---

### [C-12] `attendance-and-no-shows`
- **Estado**: `[ ]` pendiente
- **Scope**: Registro de asistencia y control de ausentismo
  - Acciones `marcarAtendido` y `marcarAusente` (solo después del inicio; recepción y odontólogo sobre sus propios turnos)
  - Ausente → incrementa `ausencias_sin_aviso`; si alcanza `max_ausencias_bloqueo` (> 0) → `bloqueado_online` (RN-CA-05)
  - Corrección de ausente → decrementa el contador sin desbloquear (RN-CA-06)
  - `/panel/agenda/sin-registrar`: turnos pasados todavía `reservado`
  - Auditoría de cada cambio de estado
  - Tests: umbral configurable (incluido 0 = sin bloqueo), corrección, no se marca antes del inicio
- **Dependencias**: C-08
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §Cancelaciones y ausencias (RN-CA)
  - `knowledge-base/07_flujos_principales.md` §Flujo 4
  - `knowledge-base/06_funcionalidades.md` §US-033
  - `knowledge-base/10_preguntas_abiertas.md` §PA-06

---

## FASE 4 — Notificaciones

### [C-13] `notifications-outbox`
- **Estado**: `[ ]` pendiente
- **Scope**: Outbox de notificaciones con canales intercambiables y job programado
  - Migración 0006: `notificacion` (unique `turno_id`+`tipo`+`canal`, índice `estado`+`programada_para`)
  - Dominio: política de generación (RN-NO-01/02/03) y render sin datos clínicos (RN-NO-07)
  - Puerto `NotificationChannel`; `EmailChannel` (Resend, reutilizando `src/shared/email`) y `FakeChannel` para tests
  - Plantillas React Email: confirmación, recordatorio, cancelación y cancelación tardía (con link de gestión)
  - Enganche en `crearTurno`, `moverTurno` y `cancelarTurno` de C-08: encolar dentro de la misma transacción
  - `POST /api/jobs/notificaciones` con `Bearer JOBS_SECRET`: lote con `FOR UPDATE SKIP LOCKED`, reintentos con espera exponencial (máximo 5), descarte de recordatorios vencidos, barrido de `enviando` colgados
  - Migración 0007: `pg_cron` cada 10 min + `pg_net` hacia el endpoint; secreto en Supabase Vault
  - Tope diario configurable de emails (límite de Resend)
  - Panel: historial de envíos por turno (US-061)
  - Tests: idempotencia, concurrencia de dos procesadores, reintentos, descarte; E2E con `FakeChannel`
- **Dependencias**: C-08
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/11_notificaciones.md`
  - `knowledge-base/05_reglas_de_negocio.md` §Notificaciones (RN-NO)
  - `knowledge-base/07_flujos_principales.md` §Flujo 3
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-03, §DD-08

---

## FASE 5 — Reserva online del paciente

### [C-14] `public-booking`
- **Estado**: `[ ]` pendiente
- **Scope**: Reserva pública sin cuenta en `/c/{slug}`
  - Páginas `/c/[slug]`: elegir prestación → profesional o "cualquier disponible" → horario → datos y consentimiento (≤ 4 pasos, responsive 390 px, accesible)
  - `GET /c/[slug]/disponibilidad` sobre C-09, con límite de solicitudes
  - Server Action `reservarTurno`: Zod, Cloudflare Turnstile, límite por IP y por DNI (RN-SE-05), identificación por DNI (RN-PA-02), `requiere_verificacion` y aviso al email de la ficha (RN-PA-03), registro de consentimiento con versión (RN-PR-01)
  - Paciente bloqueado → mensaje neutro (RN-PA-05); consultorio suspendido → aviso genérico (RN-RE-07)
  - Choque concurrente (23P01) → "Ese horario se acaba de ocupar" sin perder los datos (RN-RE-06)
  - Encola confirmación y recordatorio vía C-13; auditoría `actor_tipo = paciente`
  - Tests E2E (390×844 y 1440×900): reserva completa, DNI existente con email distinto, paciente bloqueado, carrera de dos reservas
- **Dependencias**: C-09, C-13
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md` §Flujo 1
  - `knowledge-base/06_funcionalidades.md` §US-050
  - `knowledge-base/05_reglas_de_negocio.md` §Reserva online (RN-RE), §Pacientes (RN-PA), §RN-SE-05
  - `knowledge-base/12_privacidad_y_cumplimiento.md` §PR-01, §PR-02

---

### [C-15] `patient-cancel-link`
- **Estado**: `[ ]` pendiente
- **Scope**: Ver y cancelar el turno desde el link del email
  - Página `/t/[token]`: busca el hash, valida que no esté usado ni vencido, muestra el turno
  - Aviso de cancelación tardía (< 24 h) antes de confirmar
  - `POST /t/[token]/cancelar`: estado `cancelado` o `cancelado_tarde`, token usado, descarte de notificaciones pendientes y encolado del aviso (RN-CA-01/02/03, RN-NO-03)
  - Estados terminales: link inválido, turno ya comenzado (solo lectura), ya cancelado por el personal
  - Tests: token reutilizado, vencido, borde de 24 h exactas; E2E desde el email capturado por `FakeChannel`
- **Dependencias**: C-13
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/07_flujos_principales.md` §Flujo 2
  - `knowledge-base/06_funcionalidades.md` §US-051
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CA-01..03, §RN-SE-04

---

## FASE 6 — Privacidad y cumplimiento

### [C-16] `privacy-compliance`
- **Estado**: `[ ]` pendiente
- **Scope**: Cumplimiento de la Ley 25.326 en el producto
  - Páginas `/privacidad` y `/terminos` con versión (`PRIVACY_POLICY_VERSION`), responsable y encargado, subencargados y transferencia internacional (textos a validar con asesoría legal, PA-04)
  - Anonimización (US-042, flujo 6): confirmación reforzada, cancela turnos futuros sin emails, descarta notificaciones, borra campos personales, libera el DNI y queda auditada
  - Exportación de ficha y turnos de un paciente (PDF o JSON) para el derecho de acceso, auditada (PR-04)
  - `/panel/auditoria` (solo admin): consulta filtrable del registro de auditoría
  - Revisión de logs: ningún dato personal en texto plano (RN-PR-05)
  - CSP final con Turnstile y Resend
  - Tests: anonimización irreversible y sin datos personales residuales; exportación solo admin; suite de aislamiento entre consultorios sobre todas las tablas
- **Dependencias**: C-10, C-13
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/12_privacidad_y_cumplimiento.md`
  - `knowledge-base/07_flujos_principales.md` §Flujo 6
  - `knowledge-base/05_reglas_de_negocio.md` §Privacidad (RN-PR)
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-11, §DD-12

---

## FASE 7 — Puesta en producción

### [C-17] `production-readiness`
- **Estado**: `[ ]` pendiente
- **Scope**: Despliegue del MVP para el consultorio piloto
  - **Requiere decisiones previas**: PA-01 (hosting comercial), PA-02 (plan de Supabase y backups), PA-03 (dominio de email), PA-04 y PA-05 (legales)
  - Proyecto Supabase de producción (región elegida, extensiones, `pg_cron`, Vault), migraciones aplicadas por CI
  - Hosting de producción con variables de entorno; preview deployments por pull request
  - Resend con dominio verificado (SPF y DKIM); Turnstile con claves de producción
  - CI: E2E contra preview; bloqueo de merge si fallan tests de aislamiento
  - Runbook: alta del piloto con `pnpm tenant:create`, restauración de backup, rotación de `JOBS_SECRET`
  - Checklist "antes de cargar datos reales" de `12_privacidad_y_cumplimiento.md` completo
  - Tests: smoke en producción (health, página pública, job de notificaciones con dry-run)
- **Dependencias**: C-04, C-05, C-11, C-12, C-14, C-15, C-16
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/10_preguntas_abiertas.md` §PA-01..PA-05, §IN-03
  - `knowledge-base/12_privacidad_y_cumplimiento.md` §Checklist antes de cargar datos reales
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad, §Variables de entorno
  - `knowledge-base/02_descripcion_general.md` §Integraciones externas

---

## FASE 8 — Post-MVP: WhatsApp

### [C-18] `whatsapp-channel`
- **Estado**: `[ ]` pendiente
- **Scope**: Recordatorios y confirmación por WhatsApp (prioridad 1 post-MVP)
  - **Requiere decisión previa**: PA-13 (proveedor y costo por conversación)
  - Migración: `paciente.acepta_whatsapp` + fecha; casilla de consentimiento del canal en la reserva
  - `WhatsAppChannel` (Cloud API de Meta) que implementa `NotificationChannel`; plantillas aprobadas en `templates/whatsapp/`
  - Política de canal: WhatsApp si hay consentimiento y teléfono E.164; si no, email
  - Webhook de respuestas (verificación de firma) que reutiliza `cancelarTurno` y registra la confirmación
  - Métricas de volumen por consultorio desde `notificacion`
  - Tests: política de canal, firma del webhook, idempotencia de respuestas duplicadas
- **Dependencias**: C-17
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/11_notificaciones.md` §WhatsApp
  - `knowledge-base/06_funcionalidades.md` §US-062
  - `knowledge-base/10_preguntas_abiertas.md` §PA-13
  - `knowledge-base/12_privacidad_y_cumplimiento.md`

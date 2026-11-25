# Design

## Context

El repositorio solo tiene documentación: no hay proyecto Node, base de datos ni CI. Ver `proposal.md` (Why) para la motivación y `specs/` para los requisitos.

Restricciones que dan forma al diseño:
- Las reglas duras de `AGENTS.md`: `withTenant()` siempre, RLS y test de aislamiento por tabla, solapamientos garantizados por `EXCLUDE`, migraciones solo con drizzle-kit, sin `any`, Zod en las entradas, tests de integración contra PostgreSQL real, dominio puro y fechas por `src/shared/time`. Además, solo pnpm y datos ficticios.
- En la máquina de desarrollo no hay Docker, así que Supabase CLI local no es viable.
- El modelo de datos de referencia es `knowledge-base/04_modelo_de_datos.md`. Este change crea solo un subconjunto.

## Goals / Non-Goals

**Goals:**
- Probar de punta a punta, con PostgreSQL real, que la base rechaza los solapamientos aun con concurrencia.
- Dejar armada la estructura base (`src/shared/db`, `src/shared/time`, `src/features/agenda`) que reutilizan los changes siguientes.

**Non-Goals:**
- Interfaz HTTP o de usuario: los casos de uso se invocan desde los tests.
- Autenticación y roles: el consultorio se recibe como parámetro explícito.
- Alta de pacientes y ABM de recursos: los datos se crean con fixtures ficticias en los tests y en el seed.

## Decisions

### D1. Restricciones `EXCLUDE USING gist` como garantía
Dos restricciones con nombre estable sobre `turno`:
- `turno_sin_solapamiento_profesional`: `(tenant_id WITH =, profesional_id WITH =, rango WITH &&) WHERE estado IN ('reservado','atendido','ausente')`
- `turno_sin_solapamiento_sillon`: `(tenant_id WITH =, sillon_id WITH =, rango WITH &&) WHERE sillon_id IS NOT NULL AND estado IN (...)`

`rango` es `tstzrange` con límites `[)`, así que los turnos contiguos no chocan. Necesita la extensión `btree_gist`.
**Alternativas**: validar en la app con `SELECT ... FOR UPDATE` (falla con inserciones concurrentes que no bloquean filas existentes) o con un advisory lock por profesional (no cubre el sillón compartido entre profesionales y depende de que todo el código lo respete).

### D2. Traducción del error 23P01 por nombre de restricción
La capa `infrastructure` captura el SQLSTATE `23P01` y lee `constraint`: `turno_sin_solapamiento_profesional` se traduce a `ProfesionalOcupado` y `turno_sin_solapamiento_sillon` a `SillonOcupado`. Cualquier otro error se propaga sin traducir.
**Alternativa**: consultar antes de insertar para saber qué recurso choca. Es más lento y sigue teniendo una ventana de carrera.
**Hallazgo en apply (25/11/2026)**: con dos inserciones superpuestas simultáneas, PostgreSQL puede abortar una con `40P01` (deadlock) en lugar de `23P01`, porque cada transacción registra su entrada en el índice GiST y espera a la otra antes de verificar. La garantía "como máximo uno" se mantiene, pero el error no es el de la spec. La unidad de trabajo reintenta la transacción completa ante `40P01` o `40001` (hasta 3 intentos, con espera aleatoria corta); en el reintento la fila rival ya está confirmada y el choque llega como `23P01`. El test de concurrencia lo detectó (2 de 5 corridas fallaban) y con el reintento pasó 10 corridas seguidas. Cada inserción corre en un `SAVEPOINT` para que un rechazo no aborte la transacción externa.

### D3. Validaciones de dominio puras (RN-AG-03, RN-AG-04, RN-AG-07)
`features/agenda/domain` recibe datos ya cargados (prestación, profesional, sillón, habilitación) y devuelve el turno a insertar o un error de dominio. No importa Drizzle ni el driver. RN-AG-03 se valida solo acá, porque depende de la tabla `prestacion`. Decisión del 24/11/2026.
**Alternativas descartadas**: un trigger que lea `prestacion`, o copiar `requiere_sillon` al turno con un `CHECK`. Con `crearTurno` como único punto de entrada no compensan el SQL extra. Se puede sumar el trigger más adelante sin rediseñar.

### D4. Errores como resultado tipado
Los casos de uso devuelven `{ ok: true, turno } | { ok: false, error }`, con `error` como unión discriminada: `SillonRequerido`, `PrestacionNoHabilitada`, `RecursoInactivo`, `PacienteInexistente`, `ProfesionalOcupado`, `SillonOcupado`, `TurnoNoCancelable`, `TurnoNoEncontrado`. No se usan excepciones para los rechazos de negocio, así los tests verifican cada caso sin `try/catch`.

### D5. `withTenant` con `set_config` local y rol sin `BYPASSRLS`
`withTenant(tenantId, fn)` abre una transacción, ejecuta `select set_config('app.tenant_id', $1, true)` y corre `fn(tx)`. La aplicación se conecta como `app_user`, sin `BYPASSRLS` y sin ser dueño de las tablas, porque el dueño saltea RLS salvo con `FORCE`. Las políticas usan `tenant_id = nullif(current_setting('app.tenant_id', true), '')::uuid`, así una consulta sin consultorio no ve filas en lugar de fallar.
Las migraciones corren con un rol separado (`DATABASE_URL_MIGRACIONES`). Además, `ALTER TABLE ... FORCE ROW LEVEL SECURITY` protege ante un error de configuración.

### D6. Referencias entre consultorios
Las FK de `turno` hacia profesional, sillón, prestación y paciente son compuestas (`tenant_id`, `id`). Así la base impide referenciar un recurso de otro consultorio, aunque la app falle. Requiere `unique (tenant_id, id)` en cada tabla referenciada.
**Alternativa**: FK simple por `id`. RLS ocultaría la fila al leer, pero el `INSERT` podría pasar con un id ajeno.

### D7. Reloj inyectado
`cancelarTurno` recibe un `Reloj` (`ahora(): Date`). Los tests fijan el instante para probar 23 h, 24 h exactas y 48 h. `src/shared/time` concentra la conversión entre hora local del consultorio y UTC.

### D8. PostgreSQL instalado en Windows en lugar de Supabase CLI
Desarrollo con PostgreSQL 16 o superior instalado localmente (trae `btree_gist` en contrib). En CI, un job de GitHub Actions con el servicio `postgres:16`. Es un desvío de la KB (`08_arquitectura_propuesta.md` y `02_descripcion_general.md` prevén Supabase CLI), decidido el 24/11/2026 porque no hay Docker en la máquina. La producción en Supabase no cambia: las migraciones son SQL estándar.
**Alternativas**: PGlite (una sola conexión: no permite el test de concurrencia real), Docker con Supabase CLI (instalación pesada) o tests de base solo en CI (no corren localmente).

### D9. Base de tests aislada
Los tests de integración usan una base `turnos_test` que se recrea al iniciar la suite y aplican las migraciones. Cada test crea sus consultorios con UUID nuevos, así no hace falta limpiar entre tests y pueden correr en paralelo. El test de concurrencia abre dos conexiones independientes y lanza ambas inserciones con `Promise.allSettled`.

### Estructura

```
src/shared/config.ts   carga de .env y URLs validadas con Zod
src/shared/db/         cliente (pg + drizzle), withTenant, esquema Drizzle, errores de PostgreSQL
src/shared/time/       zona horaria del consultorio <-> UTC
src/features/agenda/
  domain/              turno.ts (validaciones, regla de 24 h), errores.ts
  application/         crear-turno.ts, cancelar-turno.ts, puertos.ts
  infrastructure/      repositorio-agenda.drizzle.ts (traducción de 23P01 y reintento de 40P01)
db/migrations/         0000 extensiones, 0001 tablas, 0002 roles, 0003 RLS, 0004 EXCLUDE
db/herramientas.ts     crear base, migrar y asegurar el rol de login de la app
db/seed.ts             consultorio Demo con datos ficticios
tests/unit/            dominio y tiempo
tests/integration/     migraciones, RLS, aislamiento, exclusión, casos de uso, concurrencia
```

### Notas de implementación (desvíos menores, 25/11/2026)
- Las migraciones quedaron en cinco archivos (`0000` a `0004`) en lugar de una `0001`: drizzle-kit genera las tablas y el SQL a mano (extensión, roles, RLS, EXCLUDE) va en migraciones personalizadas separadas.
- Roles: la migración `0002` crea el grupo `app_user` (NOLOGIN, sin `BYPASSRLS`, sin `DELETE`). `pnpm db:migrate` crea el rol de login de la app (usuario y clave tomados de `DATABASE_URL`) como miembro de `app_user`.
- `consultorio` tiene RLS `id = app.tenant_id`: la app solo lee su propio consultorio. La lectura pública por slug que prevé la KB queda para el change de reserva online.
- Errores agregados a D4: `EntradaInvalida` (Zod) y `RecursoInexistente` (consultorio, profesional, sillón o prestación que no existen en el consultorio).

### Trazabilidad de escenarios (verificada el 25/11/2026)

| Spec · escenario | Test |
|------------------|------|
| turnos · Turno creado | `tests/integration/agenda/crear-turno.test.ts` "crea un turno reservado…" |
| turnos · Fin calculado | `crear-turno.test.ts` "calcula el fin…"; `tests/unit/agenda/turno.test.ts` |
| turnos · Cambio posterior de duración | `tests/integration/agenda/duracion-fija.test.ts` |
| turnos · Falta el sillón requerido | `crear-turno.test.ts` "rechaza la falta del sillón…"; unitario |
| turnos · Consulta breve sin sillón | `crear-turno.test.ts` "crea sin sillón una consulta breve…" |
| turnos · Sillón indicado en una prestación que no lo requiere | `crear-turno.test.ts` "un sillón indicado en una consulta breve queda ocupado"; unitario |
| turnos · Prestación no habilitada | `crear-turno.test.ts`; unitario |
| turnos · Profesional inactivo | `crear-turno.test.ts`; unitario (también sillón y prestación inactivos) |
| turnos · Paciente inexistente | `crear-turno.test.ts` |
| turnos · Superposición con el mismo profesional | `crear-turno.test.ts`; `tests/integration/db/exclusion.test.ts`; `tests/integration/agenda/repositorio.test.ts` |
| turnos · Turnos contiguos | `crear-turno.test.ts`; `exclusion.test.ts` |
| turnos · Otro profesional en el mismo horario | `crear-turno.test.ts` |
| turnos · Superposición en el mismo sillón | `crear-turno.test.ts`; `exclusion.test.ts`; `repositorio.test.ts` |
| turnos · Turnos sin sillón superpuestos | `crear-turno.test.ts`; `exclusion.test.ts` |
| turnos · Dos creaciones simultáneas | `tests/integration/agenda/concurrencia.test.ts` (20 repeticiones por recurso y bloqueo determinístico) |
| turnos · Cancelación con anticipación / tardía / exactamente 24 horas | `tests/integration/agenda/cancelar-turno.test.ts`; unitario |
| turnos · Turno ya comenzado o no reservado | `cancelar-turno.test.ts` (dos tests); unitario |
| turnos · Reutilizar el horario | `cancelar-turno.test.ts` "libera el profesional y el sillón…"; `exclusion.test.ts` "ignoran los turnos cancelados" |
| turnos · Hora local | `crear-turno.test.ts` (10:00 local = 13:00 UTC); `tests/unit/shared/time.test.ts` |
| aislamiento · Operación con consultorio | `crear-turno.test.ts` "crea un turno reservado…" (verifica `tenant_id`) |
| aislamiento · Lectura de otro consultorio | `tests/integration/aislamiento-consultorios.test.ts`; `tests/integration/db/rls.test.ts` |
| aislamiento · Modificación de otro consultorio | `aislamiento-consultorios.test.ts`; `cancelar-turno.test.ts` "no encuentra un turno de otro consultorio…" |
| aislamiento · Recurso de otro consultorio | `aislamiento-consultorios.test.ts` (FK compuesta, 23503); `crear-turno.test.ts` (`RecursoInexistente`) |
| aislamiento · Consulta sin consultorio | `aislamiento-consultorios.test.ts`; `rls.test.ts` |
| aislamiento · Mismo horario en dos consultorios | `crear-turno.test.ts` "acepta el mismo horario… en dos consultorios" |

## Risks / Trade-offs

- [Desvío del roadmap: este change mezcla partes de C-01, C-02 y C-08] → Anotarlo en `CHANGES.md` cuando se archive el change, sin renumerar fichas.
- [Diferencias entre PostgreSQL local y Supabase] → Migraciones en SQL estándar; las extensiones (`btree_gist`) existen en ambos; CI con una versión mayor fija.
- [Un test de concurrencia puede pasar por casualidad si las inserciones no se superponen en el tiempo] → Repetirlo varias veces en el mismo test y verificar siempre que haya exactamente un éxito.
- [El rol de la app termina siendo dueño de las tablas y saltea RLS] → Rol de migraciones separado, `FORCE ROW LEVEL SECURITY` y el test "sin consultorio no hay datos".
- [Hay que instalar PostgreSQL y pnpm antes de implementar] → Prerrequisitos explícitos en la primera tarea, con verificación (`psql --version`, `pnpm --version`).

## UI Mockups

- Decision: no (no UI), 24/11/2026. El change no tiene pantallas.

## Migration Plan

Son las primeras migraciones (`0000` a `0004`); no hay datos previos. El rollback se hace recreando la base local. No se despliega a producción en este change.

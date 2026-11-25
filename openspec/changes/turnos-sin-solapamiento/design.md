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
src/shared/db/         cliente (pg + drizzle), withTenant, esquema Drizzle
src/shared/time/       zona horaria del consultorio <-> UTC
src/features/agenda/
  domain/              turno.ts (validaciones, regla de 24 h), errores.ts
  application/         crearTurno.ts, cancelarTurno.ts, puertos.ts
  infrastructure/      repositorioTurnos.drizzle.ts (incluye la traducción de 23P01)
db/migrations/0001_*   extensiones, roles, tablas, RLS, EXCLUDE
db/seed.ts             consultorio Demo con datos ficticios
tests/unit/            dominio y tiempo
tests/integration/     solapamiento, concurrencia, aislamiento
```

## Risks / Trade-offs

- [Desvío del roadmap: este change mezcla partes de C-01, C-02 y C-08] → Anotarlo en `CHANGES.md` cuando se archive el change, sin renumerar fichas.
- [Diferencias entre PostgreSQL local y Supabase] → Migraciones en SQL estándar; las extensiones (`btree_gist`) existen en ambos; CI con una versión mayor fija.
- [Un test de concurrencia puede pasar por casualidad si las inserciones no se superponen en el tiempo] → Repetirlo varias veces en el mismo test y verificar siempre que haya exactamente un éxito.
- [El rol de la app termina siendo dueño de las tablas y saltea RLS] → Rol de migraciones separado, `FORCE ROW LEVEL SECURITY` y el test "sin consultorio no hay datos".
- [Hay que instalar PostgreSQL y pnpm antes de implementar] → Prerrequisitos explícitos en la primera tarea, con verificación (`psql --version`, `pnpm --version`).

## UI Mockups

- Decision: no (no UI), 24/11/2026. El change no tiene pantallas.

## Migration Plan

Es la primera migración (`0001`); no hay datos previos. El rollback se hace recreando la base local. No se despliega a producción en este change.

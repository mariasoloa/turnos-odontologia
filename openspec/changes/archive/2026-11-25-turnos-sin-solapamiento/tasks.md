# Tasks

> Governance CRÍTICO: no empezar la implementación sin aprobación explícita del usuario. Este change no tiene UI (`design.md` → UI Mockups: Decision: no).

## 1. Prerrequisitos y proyecto base

- [x] 1.1 Confirmar que el equipo instaló PostgreSQL 16+ en Windows y pnpm; verificar con `psql --version` y `pnpm --version`
- [x] 1.2 Crear `package.json` con pnpm, TypeScript `strict`, ESLint y los scripts `typecheck`, `lint`, `test`, `test:unit`, `test:integration`, `db:migrate` y `db:seed`; verificar que `pnpm typecheck` y `pnpm lint` pasan sobre un proyecto vacío
- [x] 1.3 Agregar dependencias (drizzle-orm, drizzle-kit, pg, zod, vitest) y configurar Vitest con los proyectos `unit` e `integration`; verificar que `pnpm test:unit` corre (sin tests todavía)
- [x] 1.4 Crear `.env.example` (`DATABASE_URL`, `DATABASE_URL_MIGRACIONES`, `DATABASE_URL_TEST`) sin valores y `.gitignore` con `.env*` excepto `.env.example`; verificar con `git status` que un `.env` local queda ignorado

## 2. Tiempo y zona horaria

- [x] 2.1 Implementar `src/shared/time` (hora local del consultorio a UTC y viceversa, diferencia en horas entre instantes) con tests unitarios: 10:00 en Buenos Aires es 13:00 UTC, bordes de 24 h exactas y de 23 h 59 min; verificar con `pnpm test:unit`

## 3. Base de datos y aislamiento entre consultorios

- [x] 3.1 Escribir el esquema Drizzle y la migración `0001` con drizzle-kit: extensión `btree_gist`; roles `app_user` (sin `BYPASSRLS`, sin ser dueño) y de migraciones; tablas `consultorio`, `profesional`, `sillon`, `prestacion`, `prestacion_profesional`, `paciente` y `turno` según `knowledge-base/04_modelo_de_datos.md`; `unique (tenant_id, id)` y FK compuestas (D6); verificar que `pnpm db:migrate` aplica limpio sobre una base vacía
- [x] 3.2 Agregar a la migración las políticas RLS con `FORCE ROW LEVEL SECURITY` y `nullif(current_setting('app.tenant_id', true), '')::uuid` en las tablas de consultorio (D5), y la lectura de `consultorio` acotada; verificar con `psql` que `app_user` no ve filas sin `app.tenant_id`
- [x] 3.3 Implementar `src/shared/db` (cliente `pg` + Drizzle y `withTenant(tenantId, fn)` con `set_config` local); verificar con un test de integración que dentro de `withTenant` se lee `app.tenant_id` y que fuera no queda fijado
- [x] 3.4 Preparar la base de tests (`turnos_test` recreada con migraciones al inicio de la suite) y fixtures con datos ficticios que crean consultorios con UUID nuevos; verificar que `pnpm test:integration` arranca y termina en verde con un test trivial
- [x] 3.5 Tests de integración de aislamiento (spec `aislamiento-consultorios`): listar sin filtro solo trae el consultorio propio, cancelar un turno ajeno no lo encuentra, un profesional de otro consultorio se rechaza por FK compuesta y sin consultorio no hay filas; verificar con `pnpm test:integration`

## 4. Dominio de turnos

- [x] 4.1 Implementar `src/features/agenda/domain` sin importar Drizzle ni el driver: errores como unión discriminada (D4), validaciones RN-AG-03, RN-AG-04 y RN-AG-07, recursos activos y regla de 24 h de cancelación; verificar con tests unitarios de cada escenario de la spec `turnos` (sillón requerido, consulta breve, prestación no habilitada, recurso inactivo, 23 h, 24 h exactas, 48 h, turno ya comenzado o no reservado)
- [x] 4.2 Agregar a la migración (o a una `0002` nueva) las restricciones `turno_sin_solapamiento_profesional` y `turno_sin_solapamiento_sillon` (D1); verificar con `psql` que dos `INSERT` superpuestos del mismo profesional fallan con SQLSTATE 23P01

## 5. Casos de uso y garantía de no solapamiento

- [x] 5.1 Implementar el repositorio Drizzle de turnos con la traducción de 23P01 por nombre de restricción a `ProfesionalOcupado` y `SillonOcupado` (D2); verificar con un test de integración que cada restricción produce su error y que otro error se propaga
- [x] 5.2 Implementar `crearTurno` (Zod en la entrada, carga de recursos dentro de `withTenant`, dominio, inserción) con estado `reservado` y origen `personal`; verificar con tests de integración: turno creado, fin calculado, profesional ocupado, sillón ocupado con otro profesional, turnos contiguos, otro profesional en el mismo horario, turnos sin sillón superpuestos y mismo horario en dos consultorios
- [x] 5.3 Implementar `cancelarTurno` con reloj inyectado (D7), `cancelado_por = personal` y fecha de cancelación; verificar con tests de integración que cancela con y sin anticipación y que el horario liberado se puede volver a reservar
- [x] 5.4 Test de concurrencia con dos conexiones independientes y `Promise.allSettled`, repetido al menos 20 veces, para el mismo profesional y para el mismo sillón; verificar que en cada repetición hay exactamente un éxito y un rechazo con el error correcto
- [x] 5.5 Verificar que un cambio posterior de la duración de la prestación no modifica un turno existente (RN-AG-04) con un test de integración

## 6. Seed, CI e integración final

- [x] 6.1 Implementar `db/seed.ts` con el consultorio Demo ficticio de la KB (profesionales, sillones, prestaciones y pacientes ficticios); verificar que `pnpm db:seed` corre dos veces sin error
- [x] 6.2 Agregar el workflow de GitHub Actions con el servicio `postgres:16`: instalar con pnpm, `typecheck`, `lint`, `test:unit`, migraciones y `test:integration`; verificar que el workflow pasa en un push de la rama
- [x] 6.3 Documentar en un `README.md` los prerrequisitos (PostgreSQL y pnpm), las variables de entorno y cómo correr migraciones, seed y tests; verificar siguiendo los pasos desde una base vacía
- [x] 6.4 Verificación final: `pnpm typecheck`, `pnpm lint`, `pnpm test:unit` y `pnpm test:integration` en verde, y cada escenario de las dos specs trazado a un test

## Workflow follow-up

- Revisión independiente antes de archivar (governance CRÍTICO).
- Al archivar, anotar en `CHANGES.md` que este change cubrió partes de C-01, C-02 y C-08, sin renumerar las fichas.

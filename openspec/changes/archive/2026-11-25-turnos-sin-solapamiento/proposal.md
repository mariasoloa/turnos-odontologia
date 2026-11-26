# Proposal

## Elección del change

Se eligió porque es el **primer imprescindible del MVP** recomendado en la sección D.3 del informe de Discovery ("agenda por profesional y por sillón/box con prevención de solapamientos en ambos recursos") y el **diferenciador "cero solapamientos"**, que casi ningún competidor evidencia según el relevamiento (sección C.3, punto 1).
Además, tiene reglas verificables (RN-AG-01 a 04, RN-AG-07, RN-AG-08 y RN-CA-02) y es una sola funcionalidad que se puede terminar en un ciclo. Se incluye la cancelación porque comparte el modelo y permite probar que liberar el horario funciona. Reprogramar queda afuera porque necesita horarios y bloqueos (C-07). El relevamiento previo está en `explore.md`.

## Why

La promesa central del producto es que un profesional o un sillón/box nunca tengan dos turnos superpuestos, incluso con reservas simultáneas.
Validarlo solo en la aplicación falla ante la concurrencia; por eso la garantía se implementa con restricciones de exclusión de PostgreSQL.
La aplicación traduce el conflicto a un error de dominio claro.

## What Changes

- Proyecto base mínimo en TypeScript (`strict`) con pnpm, Vitest, Drizzle ORM y un job de CI con PostgreSQL.
- Primera migración con las tablas indispensables: `consultorio`, `profesional`, `sillon`, `prestacion`, `prestacion_profesional`, `paciente` y `turno`. Todas las tablas de consultorio llevan `tenant_id` y RLS, y hay un rol de aplicación sin `BYPASSRLS`.
- Dos restricciones `EXCLUDE USING gist` sobre `turno`, una por profesional y otra por sillón, aplicadas solo a los estados activos (`reservado`, `atendido`, `ausente`) (RN-AG-01, RN-AG-02).
- `withTenant(tenantId, fn)`, que fija `app.tenant_id` en cada transacción.
- Caso de uso `crearTurno` (origen `personal`, paciente existente). Valida que los recursos estén activos y aplica RN-AG-03 (sillón requerido), RN-AG-04 (fin = inicio + duración de la prestación) y RN-AG-07 (prestación habilitada para el profesional). El error 23P01 se traduce a `ProfesionalOcupado` o `SillonOcupado`.
- Caso de uso `cancelarTurno` (`cancelado_por = 'personal'`): aplica la regla de 24 h (`cancelado` o `cancelado_tarde`, RN-CA-02) y libera el recurso (RN-AG-08). El reloj se inyecta.
- Tests unitarios del dominio y tests de integración contra PostgreSQL real: solapamiento, turnos contiguos, consulta breve sin sillón, liberación al cancelar, concurrencia con dos conexiones y aislamiento entre consultorios.
- **Fuera de alcance**: mover turnos, acceso del personal, pantallas, horarios y bloqueos (RN-AG-05), sobreturno (RN-AG-06), reserva online, alta de pacientes, notificaciones y auditoría.

## Capabilities

### New Capabilities
- `turnos`: creación y cancelación de turnos por el personal, con la garantía de que no se superponen turnos activos del mismo profesional ni del mismo sillón/box.
- `aislamiento-consultorios`: aislamiento de los datos de cada consultorio mediante `tenant_id`, RLS y `withTenant`.

### Modified Capabilities
- Ninguna (todavía no hay specs en el proyecto).

## Impact

- **Código nuevo**: `src/shared/db/` (cliente y `withTenant`), `src/shared/time/`, `src/features/agenda/{domain,application,infrastructure}`, `db/migrations/0001_*`, `tests/unit/` y `tests/integration/`.
- **Dependencias**: drizzle-orm, drizzle-kit, el driver `pg`, zod, vitest y typescript.
- **Entorno**: PostgreSQL instalado localmente en Windows con `btree_gist`, y el mismo en GitHub Actions. Supabase CLI local queda en reemplazo, como desvío de la KB. Prerrequisitos que instala el equipo: PostgreSQL y pnpm.
- **Roadmap**: es una porción independiente de `C-08 appointments-core`, que en `CHANGES.md` depende de `C-01` a `C-07`. Este change cubre parte de `C-01`, `C-02` y `C-08`.
- **Governance**: CRÍTICO (modelo core y aislamiento de datos). La implementación requiere aprobación explícita.

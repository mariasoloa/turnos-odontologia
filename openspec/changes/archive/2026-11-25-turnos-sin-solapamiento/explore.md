# Explore — turnos-sin-solapamiento

> Resumen de la fase **Explore** del ciclo OPSX: el relevamiento del problema y del estado del repositorio, hecho antes de proponer el change. Fecha del relevamiento: 24/11/2026.
> Este archivo se escribió el 25/11/2026, después de archivar el change, a partir de lo que registraron `proposal.md`, `design.md`, la knowledge-base y el estado del repositorio en ese momento. La sesión original de Explore no quedó guardada en un archivo.

## 1. Pregunta de partida

¿Qué funcionalidad del MVP conviene llevar primero por el ciclo OPSX, y qué hace falta saber antes de especificarla?

## 2. Estado del repositorio al empezar

- Solo había documentación: `docs/discovery/`, `knowledge-base/`, `CHANGES.md`, `AGENTS.md`, `CLAUDE.md`, `.atl/skill-registry.md` y `openspec/` recién inicializado (sin specs).
- No había proyecto Node, base de datos, tests ni CI.
- Stack definido en la KB (`08_arquitectura_propuesta.md`): TypeScript, Drizzle ORM, PostgreSQL (Supabase) y Vitest. En la máquina de desarrollo no hay Docker, así que Supabase CLI local no es viable.

## 3. Candidatos evaluados

Se tomaron de la sección D.3 del informe de Discovery (MVP imprescindible) y de las sugerencias de la consigna.

| Candidato | ¿Es del MVP? | Reglas verificables | Tamaño | Dependencias en `CHANGES.md` |
|---|---|---|---|---|
| **Crear un turno sin solapamientos por profesional y por sillón/box** | Sí: ítem 1 de D.3 y diferenciador "cero solapamientos" | RN-AG-01, 02, 03, 04, 07 y RN-RE-06 | Una funcionalidad | C-08 (depende de C-01 a C-07) |
| Cancelar un turno y liberar el horario | Sí: caso de uso de recepción "dar, mover y cancelar turnos" (`docs/discovery/discovery.md`) | RN-CA-02, RN-AG-08 | Chico, pero necesita turnos creados | C-08 |
| Reprogramar (mover) un turno | Sí: mismo caso de uso de recepción | RN-AG-01, 02 y 05 | Necesita crear, cancelar, horarios y bloqueos | C-08 y C-07 |

**Conclusión:** crear un turno sin solapamientos es la promesa central del producto y el vacío del mercado más claro del Discovery (sección C.3, punto 1). Se suma la cancelación porque es chica, comparte el modelo y permite probar RN-AG-08 (cancelar libera el horario). Reprogramar queda afuera porque necesita horarios y bloqueos (RN-AG-05), que todavía no existen.

## 4. Reglas de negocio relevadas (`knowledge-base/05_reglas_de_negocio.md`)

- **RN-AG-01 / RN-AG-02:** un profesional, o un sillón/box, no puede tener dos turnos activos (`reservado`, `atendido` o `ausente`) superpuestos.
- **RN-AG-03:** una prestación que requiere sillón lo necesita; la consulta breve sin sillón ocupa solo al profesional.
- **RN-AG-04:** la duración sale de la prestación al reservar; un cambio posterior no modifica los turnos existentes.
- **RN-AG-07:** el profesional solo atiende las prestaciones que tiene asignadas.
- **RN-AG-08:** cancelar libera de inmediato al profesional y al sillón.
- **RN-CA-02:** con 24 horas o más de anticipación, `cancelado`; con menos, `cancelado_tarde`.
- **RN-RE-06:** la reserva es atómica ante operaciones concurrentes.
- **RN-GL-01:** fechas en UTC; la regla de 24 horas se calcula con instantes absolutos.
- **Fuera de este change:** RN-AG-05 (horarios y bloqueos) y RN-AG-06 (sobreturno), porque requieren C-07.

## 5. Casos de borde detectados

- Turnos contiguos (uno termina 10:30 y el otro empieza 10:30): no deben chocar. Se resuelve con rangos `[inicio, fin)`.
- Dos creaciones simultáneas sobre el mismo profesional o sillón: debe pasar como máximo una.
- Un sillón indicado en una prestación que no lo requiere: ¿ocupa el sillón? Se decidió que sí.
- Cancelación exactamente 24 horas antes: queda `cancelado`, no `cancelado_tarde`.
- Un turno cancelado no debe bloquear el horario.
- Datos de otro consultorio: no deben verse ni poder referenciarse.

## 6. Opciones técnicas para garantizar que no haya solapamientos

| Opción | Problema |
|---|---|
| Consultar en la aplicación antes de insertar | Ventana de carrera: dos inserciones simultáneas pasan la consulta. |
| `SELECT ... FOR UPDATE` | No bloquea filas que todavía no existen. |
| Advisory lock por profesional | No cubre el sillón compartido entre profesionales y depende de que todo el código lo use. |
| **Restricción `EXCLUDE USING gist` en PostgreSQL** | Ninguno relevante: la base decide, también con concurrencia. Coincide con la regla de `AGENTS.md`. |

Se eligió `EXCLUDE` (decisión D1 de `design.md`).

## 7. Restricciones del entorno

- Sin Docker: PostgreSQL 16 instalado localmente, con `btree_gist`, y el servicio `postgres:16` en CI (decisión D8, desvío de la KB documentado).
- Las reglas de `AGENTS.md` se aplican desde el primer change: `withTenant`, RLS con test de aislamiento, tests contra PostgreSQL real y datos ficticios.

## 8. Qué se llevó a Propose

- Alcance: crear y cancelar turnos por el personal, con la garantía en la base y el aislamiento entre consultorios.
- Fuera de alcance: mover turnos, autenticación, pantallas, horarios y bloqueos, sobreturno, reserva online, alta de pacientes y notificaciones.
- Impacto en el roadmap: el change es una porción vertical que adelanta partes de C-01, C-02 y C-08 sin esperar a C-03–C-07. Se anota en `CHANGES.md` al archivar.

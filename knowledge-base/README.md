# turnos-odontologia — Base de Conocimiento

Base de conocimiento generada por entrevista (24/11/2026) a partir de `docs/discovery/discovery.md` y `docs/discovery/informe-discovery.md`.

## Índice de archivos

| Archivo | Contenido |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos por rol, alcance de la v1, fuera de alcance y métricas |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack, arquitectura general, integraciones y superficie HTTP |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Cuatro roles, matriz RBAC y rutas públicas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Entidades, ERD, restricciones de exclusión, RLS y seed |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas `RN-AG`, `RN-RE`, `RN-PA`, `RN-CA`, `RN-NO`, `RN-SE`, `RN-PR` y `RN-GL` |
| [06_funcionalidades.md](06_funcionalidades.md) | Épicas e historias US-NNN con criterios de aceptación |
| [07_flujos_principales.md](07_flujos_principales.md) | Reserva, cancelación, recordatorio, ausencias, alta de consultorio y anonimización |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, carpetas, seguridad, testing y variables de entorno |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | Decisiones DD-01 a DD-12 y supuestos SU-01 a SU-07 |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Inconsistencias IN-01 a IN-03 y preguntas PA-01 a PA-15 |
| [11_notificaciones.md](11_notificaciones.md) | Outbox y canales intercambiables (email ahora, WhatsApp después) |
| [12_privacidad_y_cumplimiento.md](12_privacidad_y_cumplimiento.md) | Ley 25.326, roles legales y checklist antes de cargar datos reales |

## Guía rápida para desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md), [11](11_notificaciones.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de escribir código → [10](10_preguntas_abiertas.md), [12](12_privacidad_y_cumplimiento.md)

## Resumen ejecutivo

turnos-odontologia es un SaaS multi-tenant para consultorios odontológicos argentinos centrado en una agenda que **no permite solapamientos de profesional ni de sillón** (garantizado por PostgreSQL), en la **reserva online sin cuenta por DNI** y en el **control configurable del ausentismo**. Se construye con Next.js, TypeScript, Drizzle, Supabase y Better Auth. Las notificaciones salen por email en el MVP, con un diseño preparado para sumar WhatsApp en la etapa siguiente. Antes de cargar datos reales hay que resolver las preguntas legales y de hosting de prioridad alta (PA-01 a PA-05).

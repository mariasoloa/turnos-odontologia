# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Posicionamiento: agenda sin solapamientos y control de ausentismo
**Decisión**: el producto compite como agenda odontológica especializada, no como suite clínica.
**Contexto**: el informe de mercado muestra 19 competidores con historia clínica y odontograma ya estándar.
**Alternativas consideradas**: suite clínica completa; agenda genérica multiespecialidad.
**Justificación**: los vacíos detectados (sillón con doble restricción, bloqueo por ausencias, cumplimiento visible) coinciden con las reglas del Discovery.
**Trade-offs aceptados**: menos funcionalidades que los líderes en la v1; consultorios que busquen "todo en uno" no lo elegirán todavía.

### DD-02 — Stack TypeScript de punta a punta con Next.js
**Decisión**: Next.js (App Router) + TypeScript + Drizzle + PostgreSQL.
**Contexto**: el equipo domina JavaScript y TypeScript; la prioridad es la mantenibilidad.
**Alternativas consideradas**: API (FastAPI o NestJS) + SPA; monolito Django o Laravel.
**Justificación**: un solo lenguaje y un solo despliegue; buen soporte de testing (Vitest y Playwright).
**Trade-offs aceptados**: dependencia del modelo de Next.js (Server Actions); el cron necesita un servicio aparte.

### DD-03 — Supabase como PostgreSQL gestionado, con pg_cron
**Decisión**: Supabase para base de datos, `pg_cron`, `pg_net` y almacenamiento. **No** se usan Supabase Auth ni el acceso directo a datos desde el cliente.
**Contexto**: el cron gratuito de Vercel corre una vez por día y el recordatorio necesita mayor frecuencia.
**Alternativas consideradas**: Neon + Upstash QStash o GitHub Actions programado.
**Justificación**: un solo proveedor; el cron vive junto a los datos.
**Trade-offs aceptados**: el plan gratuito pausa proyectos inactivos y tiene límites de tamaño (ver PA-02).

### DD-04 — Better Auth para el personal, sin cuentas de paciente
**Decisión**: Better Auth con email y contraseña, 2FA TOTP obligatorio para administradores y plugin de organizaciones.
**Contexto**: el acceso del personal expone datos de salud.
**Alternativas consideradas**: Auth.js (desaconseja contraseñas propias); Supabase Auth (acopla con el cliente de Supabase); link mágico.
**Justificación**: soporta 2FA y organizaciones listos para usar; se integra con Drizzle.
**Trade-offs aceptados**: es una librería más joven que Auth.js; hay que seguir sus actualizaciones de seguridad.

### DD-05 — Drizzle en lugar de Prisma
**Decisión**: Drizzle ORM con migraciones SQL revisadas.
**Contexto**: RLS necesita fijar `app.tenant_id` por transacción; las restricciones de exclusión y `pg_cron` requieren SQL propio.
**Justificación**: SQL explícito y control de transacciones.
**Trade-offs aceptados**: menos abstracción; parte del esquema (RLS, EXCLUDE) se mantiene en SQL a mano dentro de las migraciones.

### DD-06 — Multi-tenancy con base compartida y RLS
**Decisión**: una base, `tenant_id` en cada tabla de dominio y políticas RLS.
**Alternativas consideradas**: un esquema por consultorio; una base por consultorio.
**Justificación**: con menos de 20 consultorios es lo más simple de operar y migrar; RLS da defensa en profundidad.
**Trade-offs aceptados**: un error en una política afecta a todos los consultorios. Se mitiga con tests de aislamiento obligatorios.

### DD-07 — Solapamientos impedidos en la base de datos
**Decisión**: restricciones `EXCLUDE USING gist` sobre profesional y sillón.
**Justificación**: es la promesa central del producto; solo la base de datos la garantiza ante reservas concurrentes.
**Trade-offs aceptados**: requiere la extensión `btree_gist` y manejar el error 23P01 en la interfaz.

### DD-08 — Notificaciones con outbox y canales intercambiables
**Decisión**: tabla `notificacion` y puerto `NotificationChannel`. En el MVP solo existe `EmailChannel` (Resend).
**Contexto**: WhatsApp es la primera prioridad posterior al MVP (decisión del 24/11/2026).
**Justificación**: agregar WhatsApp es implementar un canal más, sin rediseñar la lógica.
**Trade-offs aceptados**: hay un ciclo de hasta 10 minutos para los envíos programados.

### DD-09 — Dirección del consultorio por ruta `/c/{slug}`
**Decisión**: ruta en lugar de subdominio.
**Justificación**: sin DNS comodín ni certificados por consultorio; más simple de testear.
**Trade-offs aceptados**: la URL se ve menos "propia" del consultorio.

### DD-10 — Alta de consultorios por script interno
**Decisión**: sin rol de administrador de plataforma en la aplicación; scripts `pnpm tenant:*`.
**Contexto**: el MVP no cobra suscripción y el piloto es chico.
**Justificación**: menos superficie de ataque y menos pantallas.
**Trade-offs aceptados**: el alta depende del equipo técnico y no escala a autoregistro.

### DD-11 — Supresión por anonimización
**Decisión**: anonimizar la ficha y conservar los turnos para estadísticas.
**Justificación**: cumple el derecho de supresión sin romper métricas ni la integridad referencial.
**Trade-offs aceptados**: hay que validar con asesoría legal que la anonimización equivale a supresión (PA-05).

### DD-12 — Datos alojados fuera de Argentina
**Decisión**: se aceptan proveedores con servidores fuera de Argentina (región sugerida de Supabase: São Paulo, por latencia).
**Base legal prevista**: consentimiento informado del paciente y cláusulas contractuales del proveedor.
**Trade-offs aceptados**: riesgo legal a validar (PA-04).

## Supuestos inferidos

### SU-01 — Una sola zona horaria
**Supuesto**: todos los consultorios operan en `America/Argentina/Buenos_Aires`. Igualmente se guarda `zona_horaria` por consultorio.
**Origen**: el mercado objetivo es Argentina.
**Riesgo si es falso**: errores en la regla de 24 horas y en los horarios.
**Cómo validar**: confirmar con el primer piloto.

### SU-02 — Escala inicial menor a 20 consultorios
**Supuesto**: los planes gratuitos o de bajo costo alcanzan durante el primer año.
**Origen**: respuesta P0 de la KB.
**Riesgo si es falso**: límites de Resend (100 emails por día) y de Supabase.
**Cómo validar**: monitorear el volumen de emails por día.

### SU-03 — Granularidad de 15 minutos
**Supuesto**: los turnos online arrancan cada 15 minutos (configurable).
**Origen**: práctica habitual de agenda odontológica.
**Riesgo si es falso**: la agenda queda poco aprovechada o fragmentada.
**Cómo validar**: preguntar al piloto.

### SU-04 — Anticipación mínima de 2 horas y horizonte de 60 días
**Supuesto**: valores por defecto, configurables.
**Origen**: inferido; no surgió en el Discovery.
**Riesgo si es falso**: reservas de último momento que el consultorio no ve, o agenda abierta demasiado lejos.
**Cómo validar**: preguntar al piloto.

### SU-05 — Asignación de "cualquier disponible"
**Supuesto**: se asigna al profesional con menos turnos ese día; si hay empate, por orden configurado.
**Origen**: inferido de la regla del Discovery.
**Riesgo si es falso**: distribución percibida como injusta entre profesionales.
**Cómo validar**: preguntar al piloto qué criterio prefieren.

### SU-06 — El personal marca las ausencias a mano
**Supuesto**: no hay marcado automático de ausentes.
**Origen**: no hay confirmación de asistencia en el MVP.
**Riesgo si es falso**: si nadie marca, el control de ausentismo no funciona.
**Cómo validar**: medir los turnos "sin registrar" en el piloto.

### SU-07 — Un turno = un paciente, un profesional, una prestación
**Supuesto**: no hay turnos con varias prestaciones encadenadas ni varios profesionales.
**Riesgo si es falso**: hay que modelar turnos compuestos.
**Cómo validar**: revisar casos reales con el piloto.

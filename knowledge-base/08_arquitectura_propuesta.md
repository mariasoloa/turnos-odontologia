# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| Monolito modular por funcionalidad | `src/features/*` | Un solo despliegue, con límites claros entre dominios. Favorece la mantenibilidad |
| Capas `domain` → `application` → `infrastructure` | Dentro de cada funcionalidad | Las reglas de negocio quedan en funciones puras, testeables sin base de datos |
| Multi-tenancy con base compartida, `tenant_id` y RLS | Todas las tablas de dominio | Simple de operar con pocos consultorios. RLS evita fugas de datos por errores de código |
| Contexto de tenant por transacción | `withTenant(tenantId, fn)` | Fija `set_config('app.tenant_id', id, true)` y es compatible con el pooler en modo transacción |
| Restricciones de exclusión | `turno` | Garantía de no solapamiento ante concurrencia (RN-AG-01, RN-AG-02) |
| Outbox transaccional | `notificacion` | El aviso se encola en la misma transacción que el turno. Da idempotencia y reintentos |
| Strategy / puerto de canal | `NotificationChannel` | Permite agregar WhatsApp sin tocar la lógica de turnos (ver `11_notificaciones.md`) |
| Repositorios por agregado | `features/*/infrastructure` | Aísla Drizzle del dominio |
| Server Actions con validación Zod | Mutaciones del panel y de la reserva | Menos código que una API REST propia, con validación tipada |

## Estructura de directorios

```
turnos-odontologia/
├── src/
│   ├── app/
│   │   ├── (publico)/
│   │   │   ├── c/[slug]/            # reserva online
│   │   │   ├── t/[token]/           # ver/cancelar turno
│   │   │   ├── privacidad/ terminos/
│   │   ├── (auth)/                  # login, recuperar, aceptar-invitacion
│   │   ├── panel/                   # rutas autenticadas
│   │   │   ├── agenda/ pacientes/ configuracion/ equipo/ auditoria/
│   │   └── api/
│   │       ├── auth/[...all]/       # Better Auth
│   │       └── jobs/notificaciones/ # invocado por pg_cron
│   ├── features/
│   │   ├── agenda/          { domain/ application/ infrastructure/ ui/ }
│   │   ├── reservas/        { domain/ application/ infrastructure/ ui/ }
│   │   ├── pacientes/       { ... }
│   │   ├── configuracion/   { ... }   # profesionales, sillones, prestaciones, horarios
│   │   ├── notificaciones/  { domain/ application/ channels/ templates/ }
│   │   ├── equipo/          { ... }   # membresías e invitaciones
│   │   └── auditoria/       { ... }
│   ├── shared/
│   │   ├── db/              # cliente Drizzle, withTenant(), schema/
│   │   ├── auth/            # configuración Better Auth, guards por rol
│   │   ├── time/            # utilidades de zona horaria
│   │   ├── validation/      # esquemas Zod compartidos
│   │   └── ui/              # componentes base (según el design system)
├── db/
│   ├── migrations/          # SQL generado y revisado (incluye RLS, EXCLUDE, pg_cron)
│   └── seed.ts
├── scripts/
│   ├── tenant-create.ts tenant-suspend.ts tenant-reactivate.ts
├── tests/
│   ├── unit/                # domain/ (Vitest)
│   ├── integration/         # repos, RLS, EXCLUDE, outbox (Vitest + PostgreSQL local)
│   └── e2e/                 # Playwright: reserva, cancelación, agenda
├── design-system/           # fase visual-design
├── knowledge-base/
└── docs/
```

**Regla de dependencias**: `domain` no importa nada de `infrastructure`, `app` ni Next.js. `application` orquesta usando interfaces. `ui` llama solo a `application` (vía Server Actions).

## Seguridad

- **Autenticación**: Better Auth con email y contraseña (hash fuerte, verificación de email, control de contraseñas filtradas) y plugin `twoFactor` (TOTP con códigos de respaldo), obligatorio para `admin` (RN-SE-02). Sesiones en cookie `HttpOnly`, `Secure` y `SameSite=Lax`.
- **Autorización**: guard `requireRole(['admin','recepcion'])` en cada Server Action y página, más RLS en PostgreSQL. La aplicación se conecta con un rol **sin** `BYPASSRLS`. Las migraciones y los scripts de plataforma usan un rol separado.
- **Aislamiento entre consultorios**: tests de integración obligatorios que prueban que una sesión del consultorio A no puede leer ni escribir datos del consultorio B.
- **Validación de entrada**: Zod en el servidor para toda entrada. DNI normalizado. Emails validados. Límites de longitud en textos libres.
- **Rutas públicas**: Turnstile y límite de solicitudes (por IP y por DNI, con una tabla en PostgreSQL o un almacén equivalente).
- **Tokens**: aleatorios de 256 bits en base64url, guardados con SHA-256, de un solo uso y con vencimiento.
- **Cabeceras**: CSP estricta, `X-Frame-Options: DENY`, HSTS y `Referrer-Policy: strict-origin-when-cross-origin`.
- **Gestión de secretos**: variables de entorno en Vercel (no versionadas). El secreto del job está en Supabase Vault. `.env.example` sin valores reales.
- **Logs**: estructurados y sin datos personales, referenciados solo por ID (RN-PR-05).
- **Respaldo**: los backups automáticos dependen del plan de Supabase (ver `10_preguntas_abiertas.md`).

## Estrategia de testing

| Nivel | Herramienta | Qué cubre | Cuándo corre |
|---|---|---|---|
| Unitario | Vitest | `calcularDisponibilidad`, regla de 24 horas, contador de ausencias, asignación de profesional y sillón, armado de mensajes | En cada commit (CI) |
| Integración | Vitest + PostgreSQL local (Supabase CLI) | Restricciones de exclusión con concurrencia, políticas RLS entre consultorios, outbox con `SKIP LOCKED`, anonimización | En cada pull request (CI) |
| E2E | Playwright (390×844 y 1440×900) | Reserva online completa, cancelación por token, alta de turno desde el panel, login con 2FA | En cada pull request (CI) |

El código de dominio debe tener cobertura alta (objetivo ≥ 90 %). El canal de email se reemplaza por un doble de prueba que guarda los mensajes en memoria.

## Variables de entorno

| Variable | Descripción | Ejemplo | Sensible |
|---|---|---|---|
| `DATABASE_URL` | Conexión de la app (pooler, rol sin BYPASSRLS) | `postgresql://app_user:...@...pooler.supabase.com:6543/postgres` | S |
| `DATABASE_URL_DIRECT` | Conexión directa para migraciones y scripts (rol privilegiado) | `postgresql://postgres:...@db....supabase.co:5432/postgres` | S |
| `BETTER_AUTH_SECRET` | Secreto de firma de sesiones | (32+ bytes aleatorios) | S |
| `BETTER_AUTH_URL` | URL base de la app | `https://app.ejemplo.com` | N |
| `APP_URL` | URL pública para los links de los emails | `https://app.ejemplo.com` | N |
| `RESEND_API_KEY` | API key de Resend | `re_...` | S |
| `EMAIL_FROM` | Remitente | `Turnos <turnos@ejemplo.com>` | N |
| `JOBS_SECRET` | Bearer que usa `pg_cron` para el job | (aleatorio) | S |
| `TURNSTILE_SECRET_KEY` | Verificación de Turnstile en el servidor | `0x...` | S |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Widget de Turnstile | `0x...` | N |
| `APP_DEFAULT_TIMEZONE` | Zona por defecto | `America/Argentina/Buenos_Aires` | N |
| `PRIVACY_POLICY_VERSION` | Versión vigente del consentimiento | `2026-11-v1` | N |

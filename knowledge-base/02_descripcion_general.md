# Descripción General

## Stack tecnológico

Elegido por las prioridades del proyecto: **mantenibilidad > velocidad de entrega > costo > escalabilidad**. Hay un solo lenguaje en todo el sistema (TypeScript) y se testea fácilmente con herramientas estándar. Las versiones exactas se fijan en `package.json` al iniciar el proyecto.

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Lenguaje | TypeScript (modo `strict`) | Estable vigente | Único lenguaje del sistema |
| Runtime | Node.js | LTS activa | Local, CI y Vercel |
| Framework web | Next.js (App Router, Server Components, Server Actions) | Estable vigente | Front y back en un solo proyecto |
| UI | React + Tailwind CSS | Estable vigente | Web responsive. El design system se define en la fase de diseño visual |
| Base de datos | PostgreSQL en **Supabase** | PostgreSQL ≥ 15 | Extensiones `btree_gist`, `pg_cron` y `pg_net`. Supabase se usa solo como base de datos, cron y almacenamiento |
| ORM y migraciones | **Drizzle ORM** + drizzle-kit | Estable vigente | SQL explícito; permite `set_config` por transacción para RLS |
| Autenticación | **Better Auth** | Estable vigente | Email y contraseña, plugin de 2FA (TOTP) y plugin de organizaciones (consultorio = organización) |
| Validación | Zod | Estable vigente | Validación de toda entrada: formularios, Server Actions y endpoints |
| Email | **Resend** | API vigente | Canal de email de la capa de notificaciones |
| Anti-abuso | Cloudflare Turnstile | API vigente | En el formulario público de reserva |
| Testing | Vitest (unitario e integración) + Playwright (E2E) | Estable vigente | Integración contra PostgreSQL real (Supabase CLI local) |
| Hosting | **Vercel** | — | Ver la advertencia sobre el plan Hobby en `10_preguntas_abiertas.md` |
| CI | GitHub Actions | — | Lint, typecheck, tests y migraciones de prueba |
| Gestor de paquetes | pnpm | Estable vigente | |

## Arquitectura general

Monolito modular en Next.js, organizado por funcionalidad, con una única base PostgreSQL compartida entre consultorios y aislamiento por `tenant_id` reforzado con Row Level Security.

```
                 ┌────────────────────────── Vercel ──────────────────────────┐
 Paciente ──────►│  /c/{slug}  (reserva pública, sin cuenta, Turnstile)       │
 (navegador)     │  /t/{token} (ver o cancelar turno)                         │
                 │                                                            │
 Personal ──────►│  /panel/*   (agenda, pacientes, configuración)             │
 (navegador)     │      │ Better Auth (sesión + 2FA admin)                    │
                 │      ▼                                                     │
                 │  features/* : domain → application → infrastructure        │
                 │      │                       │                             │
                 │      │ Drizzle (tx + set_config tenant)                    │
                 │      ▼                       ▼                             │
                 │  /api/jobs/notificaciones ◄──┐  NotificationChannel        │
                 └──────┬───────────────────────┼──────────┬──────────────────┘
                        │                       │          │ EmailChannel
                        ▼                       │          ▼
             ┌──────── Supabase ────────┐       │      ┌────────┐
             │ PostgreSQL + RLS          │       │      │ Resend │
             │ EXCLUDE (sin solapamiento)│       │      └────────┘
             │ pg_cron (cada 10 min) ────┼─pg_net┘   (WhatsAppChannel: post-MVP)
             └───────────────────────────┘
```

**Decisiones de alto nivel** (detalle en `09_decisiones_y_supuestos.md`):

- **Un solo proyecto Next.js** en lugar de API y SPA separadas: menos piezas que mantener. Si más adelante hace falta una API pública, se expone desde el mismo proyecto.
- **Los solapamientos se impiden en la base de datos** con restricciones de exclusión (`EXCLUDE USING gist`). El código valida antes para dar buenos mensajes de error, pero la garantía final la da PostgreSQL, incluso con reservas concurrentes.
- **Las notificaciones se envían mediante una tabla de salida (outbox).** Cada aviso se guarda como fila y un job lo procesa. Esto da idempotencia, reintentos y canales intercambiables.
- **El cron corre en Supabase (`pg_cron` + `pg_net`)**, que llama a un endpoint protegido de la aplicación. El cron gratuito de Vercel solo corre una vez por día.

## Integraciones externas

| Servicio | Propósito | Tipo | Etapa |
|---|---|---|---|
| Supabase | PostgreSQL gestionado, `pg_cron`, `pg_net` y almacenamiento | Conexión PostgreSQL (pooler) | MVP |
| Resend | Envío de emails transaccionales | API REST (SDK) | MVP |
| Cloudflare Turnstile | Verificación anti-bots en la reserva pública | Widget + verificación en el servidor (REST) | MVP |
| Vercel | Hosting y despliegue | Plataforma | MVP |
| WhatsApp Business Platform (Cloud API de Meta) | Recordatorios y confirmaciones | API REST + webhooks | **Post-MVP (prioridad 1)** |
| Mercado Pago | Señas y suscripción | API REST + webhooks | Post-MVP |
| ARCA | Facturación electrónica | Web services | Post-MVP |
| Google Calendar | Sincronización de agenda | API REST (OAuth) | Post-MVP |

## Superficie HTTP

Las operaciones del personal usan **Server Actions** sobre páginas autenticadas. Solo se exponen como endpoints REST las rutas que necesitan llamarse desde fuera de la UI:

| Método y ruta | Uso | Autenticación |
|---|---|---|
| `GET /c/{slug}` | Página pública de reserva del consultorio | Pública |
| `POST /c/{slug}/reservas` (Server Action) | Crear una reserva | Pública + Turnstile + rate limit |
| `GET /c/{slug}/disponibilidad?prestacion=&profesional=&fecha=` | Horarios libres | Pública + rate limit |
| `GET /t/{token}` | Ver el turno desde el link del email | Token de un solo uso |
| `POST /t/{token}/cancelar` | Cancelar el turno | Token de un solo uso |
| `POST /api/jobs/notificaciones` | Procesar notificaciones pendientes (lo llama `pg_cron`) | Header `Authorization: Bearer {JOBS_SECRET}` |
| `/api/auth/*` | Endpoints de Better Auth | Better Auth |

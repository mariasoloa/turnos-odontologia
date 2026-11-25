<!-- active-stack:agent-instruction -->
# turnos-odontologia — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md` (24/11/2026). No editar a mano sin re-sincronizar ambos archivos.

SaaS multi-tenant para consultorios odontológicos argentinos: agenda sin solapamientos de profesional ni de sillón (garantizado por PostgreSQL), reserva online sin cuenta por DNI y control configurable del ausentismo. Notificaciones por email en el MVP; WhatsApp es la primera prioridad posterior.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Lenguaje | TypeScript (modo `strict`) | Estable vigente |
| Runtime | Node.js | LTS activa |
| Framework web | Next.js (App Router, Server Components, Server Actions) | Estable vigente |
| UI | React + Tailwind CSS | Estable vigente |
| Base de datos | PostgreSQL en Supabase (`btree_gist`, `pg_cron`, `pg_net`) | PostgreSQL ≥ 15 |
| ORM y migraciones | Drizzle ORM + drizzle-kit | Estable vigente |
| Autenticación | Better Auth (email y contraseña, 2FA TOTP, organizaciones) | Estable vigente |
| Validación | Zod | Estable vigente |
| Email | Resend + React Email | API vigente |
| Anti-abuso | Cloudflare Turnstile | API vigente |
| Testing | Vitest (unitario e integración) + Playwright (E2E) | Estable vigente |
| Hosting y CI | Vercel + GitHub Actions | — |
| Gestor de paquetes | pnpm | Estable vigente |

Las versiones exactas se fijan en `package.json` al iniciar el proyecto. Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito y alcance |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, arquitectura y superficie HTTP |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Auth, RBAC, permisos |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD, restricciones de exclusión, RLS |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-AG, RN-RE, RN-PA, RN-CA, RN-NO, RN-SE, RN-PR, RN-GL) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura, seguridad, testing, env vars |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones DD-NN y supuestos SU-NN |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias y preguntas abiertas |
| [11_notificaciones.md](knowledge-base/11_notificaciones.md) | Outbox y canales intercambiables |
| [12_privacidad_y_cumplimiento.md](knowledge-base/12_privacidad_y_cumplimiento.md) | Ley 25.326 y checklist antes de datos reales |

> ⚠️ Las preguntas de prioridad **Alta** (PA-01 a PA-05 de `10_preguntas_abiertas.md`) bloquean el despliegue y la carga de datos reales. Revisá las de prioridad Media que afecten al change antes de empezarlo.

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Backend Core** | Base de datos, multi-tenancy, turnos y disponibilidad | `active-delivery` |
| **Backend Aux** | Auth, notificaciones, integraciones, privacidad | `active-delivery` |
| **Frontend** | Panel, reserva pública y link de cancelación | `active-delivery`, `design-taste-frontend-v1`, `emil-design-eng` |
| **Fundación** | Contexto, roadmap e instrucciones | `active-orchestrator`, `kb-creator`, `roadmap-generator`, `active-roadmap`, `agent-instruction`, `find-skill`, `skill-creator` |

Cargá la skill correspondiente al contexto ANTES de escribir código. No hay skills de stack instaladas; las recomendadas (Better Auth, Supabase, Resend, Playwright, Vitest, etc.) figuran en `.active-orchestrator-state.json` → `skills.recommended`.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 18 changes en 9 fases (C-01 a C-17 forman el MVP; C-18 `whatsapp-channel` es post-MVP).
- **Camino crítico** (9): `C-01 → C-02 → C-03 → C-06 → C-07 → C-08 → C-09 → C-14 → C-17`.
- **Primer change**: `C-01` (`project-scaffolding`).

**Antes de iniciar un item**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras

> Reglas **globales** ya definidas en el archivo global de instrucciones del cliente activo (orquestador OPSX, governance por dominio, engram, diseño visual): el proyecto las **hereda**, no se repiten acá. Acá viven solo las reglas **específicas de este proyecto** y las universales que el global no cubre. Son contrato; romperlas es un defecto.

### Datos y multi-tenancy
- NUNCA consultar datos de un consultorio fuera de `withTenant()` ni con un rol con `BYPASSRLS` → toda query pasa por `withTenant()` con el rol `app_user`.
- NUNCA crear una tabla de consultorio sin `tenant_id`, política RLS y test de aislamiento entre dos consultorios.
- NUNCA confiar solo en la validación de la app para los solapamientos → la garantía es `EXCLUDE USING gist`; el error `23P01` se mapea a un error de dominio.
- NUNCA modificar una migración ya aplicada ni cambiar el esquema a mano → generar una migración nueva numerada con drizzle-kit.
- NUNCA almacenar datos reales de pacientes en el repositorio, pruebas ni ejemplos → usar siempre datos ficticios.

### Código y testing
- NUNCA usar `any` ni confiar en una entrada sin validar → `unknown` + Zod en Server Actions, endpoints y formularios.
- NUNCA mockear la base en tests de integración → PostgreSQL real con Supabase CLI local; canales de notificación con `FakeChannel`.
- NUNCA importar Drizzle, Next.js o proveedores en `features/*/domain` → el dominio es TypeScript puro y testeable con Vitest.
- NUNCA operar fechas con la zona del servidor → guardar `timestamptz` y convertir a `America/Argentina/Buenos_Aires` solo con `src/shared/time`.

### Privacidad y seguridad
- NUNCA registrar nombre, DNI, email o teléfono en logs ni en la auditoría → solo IDs.
- NUNCA guardar datos clínicos ni enviar la obra social o información clínica en emails o mensajes.
- NUNCA llamar a Resend (u otro canal) desde un caso de uso de turnos → encolar en `notificacion` dentro de la misma transacción.
- NUNCA commitear `.env` ni secretos → solo `.env.example` con nombres de variables, sin valores.

### Flujo de trabajo
- NUNCA hacer commit o push sin pedido explícito → commitear solo los archivos y con el mensaje indicados; nunca incluir `.active-orchestrator-state.json.bak`.
- Responder y documentar en español rioplatense; el código y los identificadores siguen la nomenclatura de la KB.
- NUNCA usar npm o yarn para las dependencias del proyecto → pnpm; verificar `package.json` antes de agregar una librería.
- NUNCA desplegar ni cargar datos reales sin resolver PA-01 a PA-05 de `knowledge-base/10_preguntas_abiertas.md`.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. Acordar alcance y criterios de aceptación     → US-NNN y RN-XX-NN que cita el change
4. Implementar y verificar respetando las reglas del proyecto
5. Registrar la evidencia y actualizar el estado en CHANGES.md
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
<!-- /active-stack:agent-instruction -->

# Decisiones sobre las skills recomendadas por `find-skill`

> **BORRADOR para revisar por el grupo.** Las justificaciones están redactadas a partir de lo que hay en el repositorio (`.active-orchestrator-state.json`, `CHANGES.md` y el change archivado `2026-11-25-turnos-sin-solapamiento`). Cada integrante responsable de la etapa debe confirmar o corregir cada línea antes de commitear. Las marcadas con **[confirmar]** son de uso directo en el change implementado y su motivo depende de lo que decidió el grupo.

`find-skill` se ejecutó el 24/11/2026 en modo solo recomendación y sugirió 18 skills. **Decisión: no se instaló ninguna** (`"installed": []` en `.active-orchestrator-state.json`).

| # | Skill recomendada | Ajuste | Changes | Decisión | Justificación (una línea) |
|---|---|---|---|---|---|
| 1 | better-auth/skills@better-auth-best-practices | alta | C-03, C-05 | No instalar | La autenticación (C-03) no forma parte del change implementado; se reevalúa al empezar C-03. |
| 2 | better-auth/skills@two-factor-authentication-best-practices | alta | C-03 | No instalar | El 2FA corresponde a C-03, que no se implementó en este trabajo. |
| 3 | better-auth/skills@organization-best-practices | alta | C-03, C-05 | No instalar | La gestión de equipos (C-05) queda fuera del alcance de esta entrega. |
| 4 | better-auth/skills@better-auth-security-best-practices | alta | C-03 | No instalar | Depende de C-03; se reevalúa junto con las otras skills de Better Auth. |
| 5 | supabase/agent-skills@supabase-postgres-best-practices | alta | C-02, C-08, C-16 | No instalar **[confirmar]** | Se usó PostgreSQL local en lugar de Supabase (desvío D8 del design); las reglas de RLS y exclusión ya están fijadas en `AGENTS.md`. |
| 6 | vercel-labs/agent-skills@vercel-react-best-practices | alta | C-11, C-14 | No instalar | El change no tiene interfaz gráfica; aplica recién a las pantallas de C-11 y C-14. |
| 7 | resend/resend-skills@resend | alta | C-13 | No instalar | El envío de emails (C-13) no se implementó en este trabajo. |
| 8 | resend/react-email@react-email | alta | C-13 | No instalar | Las plantillas de email corresponden a C-13. |
| 9 | currents-dev/playwright-best-practices-skill@playwright-best-practices | alta | C-01, C-11, C-14, C-15 | No instalar | No hay interfaz que probar de punta a punta; los tests del change son unitarios y de integración con Vitest. |
| 10 | antfu/skills@vitest | alta | C-01, C-08, C-09 | No instalar **[confirmar]** | Vitest se usó en el change; completar por qué alcanzó con su documentación y las reglas de tests de `AGENTS.md`. |
| 11 | mattpocock/skills@tdd | media | C-08, C-09 | No instalar **[confirmar]** | El ciclo OPSX ya exige un test por escenario del spec; completar si el grupo lo consideró suficiente. |
| 12 | supabase/agent-skills@supabase | media | C-02, C-13, C-17 | No instalar | Supabase no se usó en este trabajo (PostgreSQL local, design D8). |
| 13 | vercel-labs/openreview@next-best-practices | media | C-01, C-14 | No instalar | No se creó la aplicación Next.js; el change es un módulo de dominio con su persistencia. |
| 14 | resend/email-best-practices@email-best-practices | media | C-13, C-17 | No instalar | Corresponde a las notificaciones (C-13), fuera del alcance. |
| 15 | addyosmani/agent-skills@security-and-hardening | media | C-14, C-16 | No instalar | Aplica a la reserva pública y a privacidad (C-14, C-16), que no se implementaron. |
| 16 | getsentry/skills@security-review | media | C-03, C-14, C-16 | No instalar | Aplica a autenticación y superficie pública, fuera del alcance de esta entrega. |
| 17 | github/awesome-copilot@github-actions-hardening | baja | C-01, C-17 | No instalar | Ajuste bajo; el workflow de CI es mínimo y no maneja secretos de producción. |
| 18 | giuseppe-trisciuoglio/developer-kit@drizzle-orm-patterns | baja | C-02, C-08 | No instalar **[confirmar]** | Drizzle se usó en el change; completar por qué alcanzó con su documentación oficial. |

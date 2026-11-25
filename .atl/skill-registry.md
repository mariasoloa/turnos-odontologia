# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

Generated: 2026-11-24 · Project: turnos-odontologia · Scanned: `~/.claude/skills/` (no other skill directories exist). Skipped: `sdd-*`, `_shared`, `skill-registry`.

Recommended but **not installed** skills live in `.active-orchestrator-state.json` → `skills.recommended`; they are not listed here.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Start or resume a unit of delivery work (roadmap item, feature, fix); choose ODD or SDD | active-delivery | C:\Users\angiesoloa\.claude\skills\active-delivery\SKILL.md |
| `/active-orchestrator init` or requests to start or resume project foundation | active-orchestrator | C:\Users\angiesoloa\.claude\skills\active-orchestrator\SKILL.md |
| ClickUp actions for CHANGES.md: preview, publish, reconcile, progress | active-roadmap | C:\Users\angiesoloa\.claude\skills\active-roadmap\SKILL.md |
| Create/update AGENTS.md or CLAUDE.md, "reglas del proyecto" | agent-instruction | C:\Users\angiesoloa\.claude\skills\agent-instruction\SKILL.md |
| Project visual policy or design system; first visual change with no recorded policy | design-system | C:\Users\angiesoloa\.claude\skills\design-system\SKILL.md |
| Frontend UI generation with strong visual taste (v1 compatibility) | design-taste-frontend-v1 | C:\Users\angiesoloa\.claude\skills\design-taste-frontend-v1\SKILL.md |
| Discovery phase before the KB: competitors and 11-point checklist | discovery-research | C:\Users\angiesoloa\.claude\skills\discovery-research\SKILL.md |
| UI polish, animation decisions, component craft; UI code review | emil-design-eng | C:\Users\angiesoloa\.claude\skills\emil-design-eng\SKILL.md |
| "Find a skill for X", "is there a skill that…" | find-skill | C:\Users\angiesoloa\.claude\skills\find-skill\SKILL.md |
| Create or complete the project knowledge base (`knowledge-base/`) | kb-creator | C:\Users\angiesoloa\.claude\skills\kb-creator\SKILL.md |
| Create, regenerate or update CHANGES.md / implementation roadmap | roadmap-generator | C:\Users\angiesoloa\.claude\skills\roadmap-generator\SKILL.md |
| Create, edit, evaluate or optimize a skill | skill-creator | C:\Users\angiesoloa\.claude\skills\skill-creator\SKILL.md |
| Research a competitor from a URL into a fixed-schema note | web-scraper | C:\Users\angiesoloa\.claude\skills\web-scraper\SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### active-delivery
- Use at the start/resume of a delivery unit, never for foundation phases
- Inspect read-only first; recommend ODD or SDD in 1–2 sentences and WAIT for confirmation before writing (unless mode is explicit or a handoff records it for the same ID and scope)
- ODD: bounded, reversible, clear acceptance. SDD: public contracts, migrations, cross-component or ownership changes
- SDD needs the `openspec` CLI; never install it; ask before `openspec init --tools claude`; if unavailable, continue ODD within authorized scope
- With SDD ready: `openspec list --json`, then `openspec status --change "<name>" --json`; resume existing changes, never duplicate
- Cross-session ODD handoff lives at `knowledge-base/entrega/<id>.md`, reusing the roadmap ID (C-NN)
- Promoting ODD→SDD requires user confirmation; never commit, stash, reset or switch branches on its own
- Reconcile the roadmap item on resume, delivery and closure; keep local verification separate from roadmap status

### active-orchestrator
- Show a single checklist (purpose, artifacts, variants, reuse) and get explicit approval before any write; a selection alone is not approval
- Phase order: discovery → kb → visual-design → roadmap → task-management → team-mode → memory-policy → find-skill → registry → agents
- Orchestrator routes and validates; each phase skill owns its own state slice (`state.kb`, `state.roadmap`, …)
- Back up existing JSON before editing; write atomically and re-read/validate
- Required phases: kb, roadmap, agents. Optional phases can be skipped/deferred and their dependents revalidated
- Never write `.engram/` files by hand; memory-policy `cloud-branch` only via `active-stack memory init`
- In Claude Code invoke as `/active-orchestrator <action>` (no colon entrypoints)

### active-roadmap
- `CHANGES.md` owns scope and dependencies; ClickUp owns status and assignees
- Read `.active-stack/roadmap.json`; missing or `mode: local` → stay in Markdown only
- Every remote write needs a preview and explicit human confirmation; the local helper never calls ClickUp
- Never write `.active-stack/roadmap.json` by hand; use `roadmap.py configure`
- Never store tokens, secrets or OAuth URLs in project files
- Never retry an uncertain write; recover the intent first

### agent-instruction
- Pre-checks: `knowledge-base/` and `02_descripcion_general.md` must exist; without CHANGES.md omit the roadmap section
- `generate` writes only missing paths, wrapped in `<!-- active-stack:agent-instruction -->` … `<!-- /active-stack:agent-instruction -->`
- Read the client's global instructions and DO NOT repeat rules already there; include universal rules the global lacks
- Hard rules are stack-aware and must be confirmed by the user before writing (the only interactive step)
- Map skills to agent roles from `.atl/skill-registry.md`; never copy compact rules into AGENTS.md/CLAUDE.md
- Never copy or paraphrase the global `active-stack:engram-cloud` block into project files
- Team-rules block only when team-mode is confirmed
- After writing, verify links and update `state.agents` (`created_by`, `files`, `reglas_applied`)

### design-system
- Honor a recorded `visual_design.mode` (state) or `Mode:` (design-system/README.md); ask only once if absent or `deferred`
- If state and README disagree, stop and ask
- Modes: `system-and-mockups` | `system-only` | `off` | `deferred`; `off`/`deferred` write only `design-system/README.md`
- Foundation files at stable paths: README.md, brand.md, brand.js, tokens.css, components.html, assets/logo.svg, previews/
- Never invent brand facts; mark unknowns `(TBD)`; provisional logos must say so visibly
- Render at 390×844 and 1440×900; wait for explicit approval before `Approval: approved`
- Changing a shared token bumps `Revision:` and resets approval

### design-taste-frontend-v1
- Check `package.json` before importing any library; print the install command if missing
- Server Components by default; isolate interactive leaves with `'use client'`
- Tailwind for styling; respect the installed major version (no v4 syntax in v3)
- No emojis anywhere in UI; use Phosphor or Radix icons with a single stroke width
- Use `min-h-[100dvh]`, never `h-screen`; use CSS Grid instead of flex percentage math
- One accent color, saturation < 80%; no purple/neon "AI" gradients; one neutral palette
- Always implement loading (skeletons), empty and error states; labels above inputs, errors below
- Animate only `transform` and `opacity`; no arbitrary z-index

### discovery-research
- Ask once for sources; with URLs, delegate each to `web-scraper`; without them, run the Q&A
- Follow the 11-point checklist in rounds of 3–5 questions with options and "por qué importa"
- Don't re-ask what sources already answered; show it for confirmation
- Unverified assumptions go to risks and open questions
- Gate: show the full summary and wait for explicit confirmation before writing
- Write only `discovery.md` (this project: `docs/discovery/discovery.md`) and `state.discovery`

### emil-design-eng
- UI reviews MUST use a single `| Before | After | Why |` markdown table
- Decide whether to animate by frequency: never animate keyboard-initiated or 100+/day actions
- Every animation needs a purpose (spatial consistency, state, feedback, explanation)
- Specify exact transition properties, never `transition: all`
- Entrances start from `scale(0.95)` + `opacity: 0`, never `scale(0)`
- Prefer `ease-out` for UI responses; buttons get an `:active` press state
- Popovers scale from their trigger; modals stay centered

### find-skill
- Search with `npx skills find <query>`; check the skills.sh leaderboard first
- Recommend only after checking installs (prefer 1K+, wary under 100), source reputation and repo stars
- Present name, purpose, installs, source, install command and skills.sh link
- Install only with user consent: `npx skills add <owner/repo@skill> -g -y`
- If nothing fits, say so and offer to help directly

### kb-creator
- Output goes to `knowledge-base/` at the root, never into `docs/`
- 10 canonical files with exact names (01_vision_y_objetivos … 10_preguntas_abiertas) + README.md; extras use `1X_` prefixes and never replace canonicals
- Never overwrite existing verified KB files; complete only missing ones
- Interview mode: 3–5 strategic questions, wait for answers, mark `**Suposición:**`
- Import mode: no questions; ambiguities go to `10_preguntas_abiertas.md`
- Orchestrated: write only `state.kb` (source `interactive` or `ingest`); never invent discovery fields

### roadmap-generator
- Pre-check the 10 canonical KB files; output a single `CHANGES.md` at the root
- Top-level sections are a contract: Cómo usar, Árbol, Paralelismo (GATES), Camino crítico, Plan 3 agentes, FASES
- Each ficha: Estado, Scope (operational bullets), Dependencias, Governance (BAJO/MEDIO/ALTO/CRITICO), Leer antes (3–5 KB files with §)
- IDs `C-NN`, never renumbered or recycled
- Verify with `fichas.bat --root . verify` (Windows) or `sh fichas.sh --root . verify`
- Team-mode fields (Resultado, Depende de, Zona, Requiere, Modo, Responsable) only when `.active-stack/team.json` exists
- Orchestrated: write only `state.roadmap`; never touch `step`

### skill-creator
- Capture intent first: what, when it triggers, output format, whether tests apply
- `description` is the trigger: include what it does and when; make it slightly "pushy"
- Draft, then run test prompts and evaluate with the user; iterate on feedback
- Adapt jargon to the user's familiarity; explain terms briefly when unsure

### web-scraper
- Fixed 8-field schema, always in the same order; missing data = `(no publicado)`
- Never invent data the page does not show
- No crawling or mass scraping; only explicit URLs
- On empty SPA, 403, CAPTCHA or paywall: report the limitation, no evasion tricks
- Filename via `scripts/slugify.py`; output `discovery/sources/<slug>.md`
- Process URLs one by one; report successes and failures at the end

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| — | — | No AGENTS.md, CLAUDE.md, .cursorrules, GEMINI.md or copilot-instructions.md at the project root yet. `agents` phase will create AGENTS.md and CLAUDE.md; re-run this registry afterwards. |

Read the convention files listed above for project-specific patterns and rules. All referenced paths have been extracted — no need to read index files to discover more.

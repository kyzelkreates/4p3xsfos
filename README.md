# 4P3X ScenarioForge OS™

**Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™**

---

## What is ScenarioForge OS™?

4P3X ScenarioForge OS™ is an AI-assisted scenario simulation, decision mapping, and
future planning platform. It is part of the **4P3X Verse™** — a modular AI-powered
product architecture that demonstrates how one codebase can become many sector-specific
intelligent products.

> 4P3X Verse™ — One Modular Architecture. Many AI-Powered Products.
> Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™.

---

## Key Features

- **Scenario Workspace** — local-first SSOT, create and edit scenario records
- **Scenario Matrix** — stakeholder, decision, assumption and evidence counts
- **Stakeholder Mapping** — influence, priority, benefit and risk heatmap
- **Decision Tree Builder** — compare branch cost, risk, upside and confidence
- **AI Agent Council** — four advisory agents (Strategy, Risk, Evidence, Execution)
- **Future Timeline Simulator** — best/expected/risk/failure/partnership paths
- **Outcome Comparison Table** — branch-by-branch comparison view
- **Confidence Dashboard** — readiness score and do-not-proceed-unless logic
- **Intelligence Report Exporter** — downloadable .txt report from active scenario
- **Evidence Pack Generator** — claim strength scoring and proof checklist
- **API Config Guard™** — safe environment boundary and secret block list
- **Demo / Live Mode** — safe sample data vs backend-ready live operation
- **PWA-ready** — manifest, service worker, offline fallback, installable

---

## Demo Mode vs Live Mode

| | Demo Mode | Live Mode |
|---|---|---|
| Data source | Seeded local sample data | Backend-connected (Supabase/REST) |
| Backend required | No | Yes |
| Offline | ✓ fully offline | Depends on backend |
| Safe to share | ✓ yes | After data protection review |

**Demo Mode shows the product. Live Mode runs the product.**

---

## AI Agent Council

All agents are **advisory**. They provide confidence-based simulation estimates.
They cannot guarantee outcomes, make final legal/safety decisions, or replace human review.

| Agent | Purpose |
|---|---|
| 4P3X Strategy AI™ | Opportunity, timing, stakeholder readiness |
| 4P3X Risk AI™ | Operational, financial, legal and safety risks |
| 4P3X Evidence AI™ | Proof strength, unsupported claims, report readiness |
| 4P3X Execution AI™ | Minimum viable rollout path and blockers |

---

## Local-First Architecture

State is managed through a single local-first SSOT (`src/storage.js`). All scenario data
is persisted in `localStorage` under the key `scenarioforge-os-state-v1`. No data leaves
the browser unless a backend is explicitly configured and live mode is active.

---

## Project Structure

```
/
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
├─ SUPABASE_FULL_SETUP.sql.txt
├─ BASE44_FINAL_POLISH_HANDOFF_PROMPT.txt
├─ manifest.webmanifest
├─ public/
│  ├─ sw.js
│  └─ icons/
│     ├─ icon-192.png
│     └─ icon-512.png
└─ src/
   ├─ main.jsx       — UI components and app shell
   ├─ styles.css     — Premium futuristic dark theme
   ├─ storage.js     — Local-first SSOT (single source of truth)
   ├─ data.js        — Brand, seed state, demo scenarios, nav config
   └─ engines.js     — Scoring, agent review, outcome paths, feeds
```

---

## Getting Started

```bash
npm install
npm run dev       # local dev server → http://localhost:5173
npm run build     # production build → /dist
npm run preview   # preview production build locally
```

---

## Backend Readiness (Supabase)

See `SUPABASE_FULL_SETUP.sql.txt` for the full database schema, RLS configuration,
and deployment instructions. Live mode requires:

- Supabase project URL (client-safe, public)
- Supabase anon key (client-safe, public)
- Row-level security (RLS) enabled for all live tables

**Never expose service role keys, private keys, or admin tokens in frontend code.**

---

## Portfolio Note

ScenarioForge OS™ demonstrates that the 4P3X Verse™ architecture is not limited to
dashboards or PWAs. The same modular base supports strategic simulation, multi-agent
advisory systems, decision-tree modelling, evidence-based reporting, and future-planning
intelligence — proving genuine architectural versatility across product categories.

---

*4P3X ScenarioForge OS™ — Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™*

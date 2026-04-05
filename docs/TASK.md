# TASK.md — Portfolio V2.0 Implementation Tasks

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Infrastructure Setup (Turso + Netlify)

- [x] **0.1** Run `pnpm astro add netlify` — installs adapter and auto-updates `astro.config.mjs`
- [x] **0.2** ~~Set `output: 'hybrid'`~~ — removed in Astro 6; `output: 'static'` (default) behaves identically
- [x] **0.3** Run `pnpm add @libsql/client` — install Turso client
- [x] **0.4** Create `src/lib/turso.ts` — Turso client singleton using `@libsql/client/web`
- [x] **0.5** Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to `.env` (local dev — fill in real values)
- [ ] **0.6** Add same env vars to Netlify dashboard → Site settings → Environment variables *(manual — do before first deploy)*
- [ ] **0.7** Install Turso CLI (`curl -sSfL https://get.tur.so/install.sh | bash`) → authenticate (`turso auth login`) → create DB (`turso db create racharta-portfolio`)
- [ ] **0.8** Run schema: `turso db shell racharta-portfolio < docs/schema.sql`
- [ ] **0.9** Seed data: `turso db shell racharta-portfolio < docs/seed.sql`
- [x] **0.10** Add `.env.example` with placeholder values

---

## Phase 1 — Foundation & Navigation

- [x] **1.1** Create `docs/` folder and confirm `PLAN.md` + `TASK.md` exist *(planning only)*
- [x] **1.2** Update `src/layouts/Layout.astro` — add `<Navbar />` slot and update `<SEO>` with keyword-rich metadata
- [x] **1.3** Add JSON-LD `Person` schema in `Layout.astro` `<head>`
- [x] **1.4** Create `src/components/Navbar.astro` — desktop links in authority-funnel order
- [x] **1.5** Add hamburger mobile menu to `Navbar.astro` — CSS toggle with minimal JS
- [x] **1.6** Add sticky + backdrop-blur styling to Navbar
- [x] **1.7** Add active page highlight to Navbar links

---

## Phase 2 — Home Page

- [ ] **2.1** Replace `src/components/Welcome.astro` with new `src/components/Hero.astro`
- [ ] **2.2** Implement typewriter effect in `Hero.astro` with vanilla JS (no external lib)
  - Strings: `["AI & Automation Architect", "GenAI Curriculum Specialist", "Top Tech Content Creator"]`
- [ ] **2.3** Add hero headline: `Hi, I'm Rachmawati Ari Taurisia`
- [ ] **2.4** Add hero statement paragraph (full text per PLAN.md §2.1)
- [ ] **2.5** Add two CTA buttons using Starwind UI Button component:
  - Primary: `View My Automation Blueprints` → `/projects`
  - Secondary: `Subscribe to My Insights` → `/writing`
- [ ] **2.6** Install Starwind Button component via `starwind add button`
- [ ] **2.7** Create `src/components/LogoStrip.astro` — grayscale logos with hover-to-color effect
- [ ] **2.8** Collect/source SVG logos: Google Cloud, SMKDEV, EUDEKA, WomenTech Network → `src/assets/logos/`
- [ ] **2.9** Update `src/pages/index.astro` to use `<Hero />` and `<LogoStrip />`

---

## Phase 3 — Projects Page

- [ ] **3.1** Add n8n workflow canvas screenshots to `src/assets/workflows/` (3 images, one per project — provided by client)
- [ ] **3.2** Seed `projects` table in Turso with 3 project rows (sanitized `blueprint_snippet` — no credentials)
- [ ] **3.3** Install Starwind Card and Badge components: `starwind add card badge`
- [ ] **3.4** Create `src/components/ProjectCard.astro` with:
  - `<Image>` from `astro:assets` for workflow screenshot
  - Title, description ("Production-Ready Blueprint"), stack tag badges
  - Toggle button for blueprint viewer
- [ ] **3.5** Create `src/components/BlueprintViewer.astro` — `<pre><code>` with Shiki syntax highlight + JS toggle
- [ ] **3.6** Create `src/pages/projects/index.astro` — query Turso `projects` table at build time, render `<ProjectCard />` per row

---

## Phase 4 — Speaking Page

- [ ] **4.1** Seed `speaking` table in Turso with 1 workshop row (modules as JSON string)
- [ ] **4.2** Create `src/pages/speaking.astro` — query Turso `speaking` table at build time, render featured workshop section
  - "Featured Commercial Workshop" badge
  - EUDEKA + SMKDEV logos (prominent)
  - Workshop title, meta, description
  - Training module list
  - CTA button linking to `https://goakal.com/smkdev/productivity-workflow-automation-ai-assistant`
- [ ] **4.3** Add JSON-LD `Course` schema in speaking page `<head>`

---

## Phase 5 — Writing Page

- [ ] **5.1** Seed `writing` table in Turso with 3 article rows
- [ ] **5.2** Create `src/pages/writing.astro` — query Turso `writing` table at build time, render article cards with category badge and external link

---

## Phase 6 — Publications Page

- [ ] **6.1** Seed `publications` table in Turso with 2 journal rows + citation rows
- [ ] **6.2** Create `src/pages/publications.astro` — query Turso `publications` table at build time, render journal cards + citations subsection

---

## Phase 7 — Contact Page

- [ ] **7.1** Create `src/pages/contact.astro` with `export const prerender = false` (SSR on Netlify)
- [ ] **7.2** Add Netlify Forms: `<form netlify data-netlify="true">` — no backend code needed, Netlify handles submissions

---

## Phase 8 — SEO & Performance

- [ ] **8.1** Add unique `<SEO>` title + description to every page (projects, speaking, writing, publications, contact)
- [ ] **8.2** Verify all n8n screenshots use `<Image>` from `astro:assets` (not `<img>` tags)
- [ ] **8.3** Verify all logo assets use SVG inline or `<Image>` — no unoptimized rasters
- [ ] **8.4** Test mobile hamburger menu at 375px breakpoint
- [ ] **8.5** Test responsive layout at 768px (tablet) and 1280px (desktop)
- [ ] **8.6** Run `pnpm build` and confirm 0 TypeScript errors

---

## Phase 9 — Security & Code Review

- [ ] **9.1** Audit Turso `projects` table — confirm `blueprint_snippet` column contains zero API keys, webhook URLs, Telegram tokens, Gmail credentials
- [ ] **9.2** Confirm `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are never referenced in client-side code (only in `src/lib/turso.ts` and page frontmatter)
- [ ] **9.3** Verify `.env` is in `.gitignore` and `.env.example` exists with placeholder values
- [ ] **9.4** Run `git grep -i "api_key\|token\|secret\|password"` across `src/` before first commit

---

## Dependency: Assets & Credentials Needed Before Implementation

Before Phase 0 can complete (0.7–0.9), you need:
- Turso CLI installed + account authenticated (`turso auth login`)
- Turso database URL and auth token

Before Phase 3 can begin, these assets must be provided:

| Asset | Format | Used In |
|---|---|---|
| n8n canvas screenshot — Invoice Tracker | PNG, min 1200px wide | ProjectCard |
| n8n canvas screenshot — AI Chatbot | PNG, min 1200px wide | ProjectCard |
| n8n canvas screenshot — Persona Assistant | PNG, min 1200px wide | ProjectCard |
| SMKDEV logo | SVG preferred | Navbar, LogoStrip, Speaking |
| EUDEKA logo | SVG preferred | LogoStrip, Speaking |
| Google Cloud logo | SVG (public) | LogoStrip |
| WomenTech Network logo | SVG preferred | LogoStrip |

---

## Implementation Order (Recommended)

```
Phase 1 (Nav) → Phase 2 (Home) → Phase 3 (Projects) → Phase 4 (Speaking)
→ Phase 5 (Writing) → Phase 6 (Publications) → Phase 7 (Contact)
→ Phase 8 (SEO/Perf) → Phase 9 (Security audit)
```

Each phase should be a separate PR — do not merge directly to `main`.

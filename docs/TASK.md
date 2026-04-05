# TASK.md — Portfolio V2.0 Implementation Tasks

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Infrastructure Setup (Turso + Netlify) ✅ COMPLETE

- [x] **0.1** Run `pnpm astro add netlify` — installs adapter and auto-updates `astro.config.mjs`
- [x] **0.2** ~~Set `output: 'hybrid'`~~ — removed in Astro 6; `output: 'static'` (default) behaves identically
- [x] **0.3** Run `pnpm add @libsql/client` — install Turso client
- [x] **0.4** Create `src/lib/turso.ts` — Turso client singleton using `@libsql/client/web`
- [x] **0.5** Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to `.env` (real values from DB `porto-ibu`, group `ibu`)
- [ ] **0.6** Add same env vars to Netlify dashboard → Site settings → Environment variables *(manual — do before first deploy)*
- [x] **0.7** Turso CLI confirmed at `/Users/antonioperez/.turso/turso`; authenticated as `hasban-fardani`; used existing DB `porto-ibu`
- [x] **0.8** Run schema: `turso db shell porto-ibu < docs/schema.sql` ✓ all 4 tables created
- [x] **0.9** Seed data: `turso db shell porto-ibu < docs/seed.sql` ✓ projects=3, writing=3, publications=4, speaking=1
- [x] **0.10** Add `.env.example` with placeholder values

---

## Phase 1 — Foundation & Navigation ✅ COMPLETE

- [x] **1.1** Create `docs/` folder and confirm `PLAN.md` + `TASK.md` exist
- [x] **1.2** Update `src/layouts/Layout.astro` — add `<Navbar />` slot and update `<SEO>` with keyword-rich metadata
- [x] **1.3** Add JSON-LD `Person` schema in `Layout.astro` `<head>`
- [x] **1.4** Create `src/components/Navbar.astro` — desktop links in authority-funnel order
- [x] **1.5** Add hamburger mobile menu to `Navbar.astro` — CSS toggle with minimal JS
- [x] **1.6** Add sticky + backdrop-blur styling to Navbar
- [x] **1.7** Add active page highlight to Navbar links

---

## Phase 1.5 — Animation Infrastructure ✅ COMPLETE

- [x] **A.1** ~~`pnpm add tailwind-animations`~~ — `tw-animate-css` already installed; used that for on-load animations
- [x] **A.2** Add scroll animation CSS to `starwind.css`: `[data-animate]` base + `is-visible` transition state + `prefers-reduced-motion` override
- [x] **A.3** Stagger via inline `style="transition-delay: Xms"` on each animated child element
- [x] **A.4** IntersectionObserver inlined in `Layout.astro` `<script>` — adds `is-visible` when element enters viewport, then unobserves
- [x] **A.5** Global script active in `Layout.astro` — fires on `DOMContentLoaded` across all pages

---

## Phase 2 — Home Page ✅ COMPLETE

- [x] **2.1** Created `src/components/Hero.astro` (replaced Welcome.astro)
- [x] **2.2** Typewriter effect — vanilla JS, cycles 3 strings, starts at 1000ms after load
- [x] **2.3** Hero headline with `animate-in fade-in slide-in-from-top-4 duration-700`
- [x] **2.4** Hero paragraph with `animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:450ms]`
- [x] **2.5** Two CTA buttons — Primary (bg-primary) + Secondary (bordered), animate in at 650ms delay
- [x] **2.6** Buttons styled with semantic design tokens — no Starwind Button needed at this stage
- [x] **2.7** Created `src/components/LogoStrip.astro` — grayscale + hover-to-color, scroll-triggered stagger
- [ ] **2.8** Placeholder SVGs in use — **awaiting real assets**: Google Cloud, SMKDEV, EUDEKA, WomenTech Network
- [x] **2.9** `src/pages/index.astro` updated to use `<Hero />` and `<LogoStrip />`

---

## Phase 3 — Projects Page ✅ COMPLETE

- [~] **3.1** SVG placeholder images created in `public/workflows/` — **awaiting real PNG screenshots from client** (invoice-tracker.png, ai-chatbot-smkdev.png, persona-assistant.png)
- [x] **3.2** Seed `projects` table already done in Phase 0.9
- [x] **3.3** ~~Starwind Card/Badge~~ — built custom components with Tailwind tokens instead (no external dep needed)
- [x] **3.4** Created `src/components/ProjectCard.astro`:
  - `<img loading="lazy">` for workflow screenshot (swap to `<Image>` once real PNGs are available)
  - Title, description, "Production-Ready Blueprint" overlay badge
  - Stack tag badges (parsed from JSON array)
  - `data-animate` scroll-trigger + stagger delay per card index
- [x] **3.5** Created `src/components/BlueprintViewer.astro` — `<pre><code>` JSON toggle, JS expand/collapse with chevron rotate
- [x] **3.6** Created `src/pages/projects/index.astro` — queries Turso `projects` table at build time, renders `<ProjectCard />` per row
  - Page hero with `animate-in fade-in slide-in-from-top-4` animations

---

## Phase 4 — Speaking Page ✅ COMPLETE

- [x] **4.1** Seed `speaking` table already done in Phase 0.9
- [x] **4.2** Create `src/pages/speaking.astro` — query Turso `speaking` table at build time
  - "Featured Commercial Workshop" badge
  - Provider badge (EUDEKA x SMKDEV) + date/role meta row — staggered
  - Workshop title, meta, description — `data-animate` scroll stagger
  - Training module list items — numbered, staggered per item
  - CTA button → `https://goakal.com/smkdev/productivity-workflow-automation-ai-assistant`
- [x] **4.3** Add JSON-LD `Course` schema in speaking page `<head>`

---

## Phase 5 — Writing Page ✅ COMPLETE

- [x] **5.1** Seed `writing` table already done in Phase 0.9
- [x] **5.2** Create `src/pages/writing.astro` — query Turso `writing` table at build time
  - Article cards: `data-animate` with stagger, color-coded category badge and external link
  - Date column + animated "Read article" arrow link

---

## Phase 6 — Publications Page ✅ COMPLETE

- [x] **6.1** Seed `publications` table already done in Phase 0.9
- [x] **6.2** Create `src/pages/publications.astro` — query Turso `publications` table at build time
  - Journal cards: `data-animate` staggered
  - Citations subsection: `data-animate` staggered, amber badge, `bg-muted/30` background

---

## Phase 7 — Contact Page ✅ COMPLETE

- [x] **7.1** Create `src/pages/contact.astro` with `export const prerender = false` (SSR on Netlify)
- [x] **7.2** Add Netlify Forms: `<form netlify data-netlify="true">` + honeypot field — no backend code needed
  - Form fields: `data-animate` staggered on scroll
  - POST handler: server-side validation + success/error state

---

## Phase 8 — SEO & Performance ✅ COMPLETE

- [x] **8.1** Add unique `<SEO>` title + description to every page (projects, speaking, writing, publications, contact) — all sub-pages pass unique title/description to `<Layout>`; home uses layout-level defaults which are homepage-appropriate
- [~] **8.2** Verify all n8n screenshots use `<Image>` from `astro:assets` (not `<img>` tags) — **deferred**: `ProjectCard.astro` uses `<img loading="lazy">` intentionally; swap to `<Image>` once real PNG screenshots replace SVG placeholders in `public/workflows/`
- [x] **8.3** Verify all logo assets use SVG inline or `<Image>` — `LogoStrip.astro` uses inline SVGs via `Fragment set:html`; no unoptimized rasters
- [~] **8.4** Test mobile hamburger menu at 375px breakpoint — manual visual test required
- [~] **8.5** Test responsive layout at 768px (tablet) and 1280px (desktop) — manual visual test required
- [x] **8.6** Run `pnpm build` and confirm 0 TypeScript errors — ✓ clean build: 5 static routes + 1 SSR Netlify function
- [x] **8.7** Add `prefers-reduced-motion` override in `starwind.css` — already present (lines 192–206): disables `[data-animate]` transitions and `animate-in` animations

---

## Phase 9 — Security & Code Review ✅ COMPLETE

- [x] **9.1** Audit Turso `projects` table — `blueprint_snippet` contains only structural node type/role data (e.g. `{ "type": "Gmail Trigger", "role": "..." }`); zero API keys, webhook URLs, Telegram tokens, or Gmail credentials
- [x] **9.2** Confirm `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are never referenced in client-side code — only in `src/lib/turso.ts` via `import.meta.env` (server-side); grep across `src/` confirms no leakage
- [x] **9.3** Verify `.env` is in `.gitignore` — ✓ `.env` and `.env.production` listed; `.env.example` exists with placeholder values
- [x] **9.4** Run `git grep -i "api_key\|secret\|password"` across `src/` — zero matches; `token` only appears in `src/lib/turso.ts` as `import.meta.env.TURSO_AUTH_TOKEN` (server-side env var)

---

## Dependency: Assets Needed Before Implementation

Before Phase 3 can begin:

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

## Implementation Order (Updated)

```
Phase 1.5 (Animations infra) → Phase 2 (Home) → Phase 3 (Projects)
→ Phase 4 (Speaking) → Phase 5 (Writing) → Phase 6 (Publications)
→ Phase 7 (Contact) → Phase 8 (SEO/Perf) → Phase 9 (Security audit)
```

Each phase should be a separate PR — do not merge directly to `main`.

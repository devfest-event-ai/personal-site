# PLAN.md — Portfolio V2.0: Proof-of-Work Platform

**Project:** racharta.netlify.app (hosting: Netlify)
**Stack:** Astro 6 + Tailwind CSS v4 + Starwind UI + Turso (libSQL)
**Brand Identity:** AI & Automation Curriculum Architect
**Goal:** Transform static resume → high-authority "Proof-of-Work" platform targeting Purwadhika & TalentConnect recruiters.

---

## Architecture Overview

```
src/
├── layouts/
│   └── Layout.astro          # Root shell — SEO + JSON-LD + Navbar [DONE]
├── components/
│   ├── Navbar.astro           # Authority-funnel nav + hamburger [DONE]
│   ├── Hero.astro             # Typewriter + CTA + social proof logos
│   ├── ProjectCard.astro      # n8n blueprint card component
│   ├── BlueprintViewer.astro  # JSON code snippet viewer (Shiki)
│   └── LogoStrip.astro        # Google Cloud/SMKDEV/EUDEKA logos
├── pages/
│   ├── index.astro            # Home — brand identity (prerendered)
│   ├── projects/
│   │   └── index.astro        # Projects gallery (prerendered, Turso query)
│   ├── speaking.astro         # Speaking — workshop proof (prerendered, Turso query)
│   ├── writing.astro          # Writing — newsletter articles (prerendered, Turso query)
│   ├── publications.astro     # Publications — academic authority (prerendered, Turso query)
│   └── contact.astro          # Contact — SSR (Netlify Forms, server-rendered)
├── lib/
│   └── turso.ts               # Turso client singleton
├── assets/
│   ├── logos/                 # SMKDEV, EUDEKA, Google Cloud, WomenTech
│   └── workflows/             # n8n canvas screenshots (optimized)
└── styles/
    └── starwind.css           # (existing — no changes needed)
```

---

## Hosting & Rendering Mode

**Platform:** Netlify via `@astrojs/netlify` adapter.

**Output mode:** `static` (default in Astro 6 — replaces the deprecated `hybrid` mode, behaves identically)
- Content pages (Home, Projects, Writing, Speaking, Publications) → **prerendered** at build time — Turso is queried during `astro build`, output is static HTML. Fast CDN delivery, zero cold-starts.
- Contact page → **server-rendered** (`export const prerender = false`) — enables Netlify Forms processing and future Astro Actions.

This means Turso acts as a **build-time data source** (like a headless CMS), not a runtime dependency. No DB connection in production traffic. To update content, redeploy the site (Netlify CI trigger).

---

## Phase 0 — Infrastructure Setup

### 0.1 Install Netlify Adapter
```bash
pnpm astro add netlify
```
This automatically updates `astro.config.mjs`. Note: Astro 6 removed `output: 'hybrid'` — `output: 'static'` (the default) now behaves the same way. No explicit output setting is needed:
```js
import netlify from '@astrojs/netlify';
export default defineConfig({
  adapter: netlify(),
  // output: 'static' is default — pages prerendered unless export const prerender = false
});
```

### 0.2 Install Turso Client
```bash
pnpm add @libsql/client
```

### 0.3 Create Turso Client Singleton (`src/lib/turso.ts`)
```ts
import { createClient } from "@libsql/client/web";
export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});
```

### 0.4 Environment Variables
```
# .env (local dev — never commit)
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```
Set the same vars in Netlify dashboard → Site settings → Environment variables.

### 0.5 Database Schema (run once via Turso CLI)
```sql
CREATE TABLE projects (
  id        INTEGER PRIMARY KEY,
  title     TEXT NOT NULL,
  slug      TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  json_source TEXT NOT NULL,
  stack     TEXT NOT NULL,        -- JSON array stored as text: '["n8n","Gmail API"]'
  screenshot_url TEXT NOT NULL,   -- URL to image in /public or CDN
  blueprint_snippet TEXT NOT NULL -- sanitized JSON excerpt (no credentials)
);

CREATE TABLE writing (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT NOT NULL,
  url         TEXT NOT NULL,
  published_date TEXT NOT NULL
);

CREATE TABLE publications (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  journal     TEXT NOT NULL,
  published_date TEXT NOT NULL,
  abstract    TEXT NOT NULL,
  doi_url     TEXT,
  type        TEXT NOT NULL  -- 'journal' | 'citation'
);

CREATE TABLE speaking (
  id          INTEGER PRIMARY KEY,
  title       TEXT NOT NULL,
  provider    TEXT NOT NULL,
  event_date  TEXT NOT NULL,
  role        TEXT NOT NULL,
  description TEXT NOT NULL,
  link        TEXT NOT NULL,
  modules     TEXT NOT NULL  -- JSON array as text
);
```

### 0.6 Seed Initial Data (via Turso CLI or `turso db shell`)
Insert the 3 projects, 3 writing articles, 2 publications, 1 speaking event per content spec.

---

## Phase 0 — Infrastructure ✅ DONE

- Turso DB: `porto-ibu` (group `ibu`) — URL: `libsql://porto-ibu-hasban-fardani.aws-ap-northeast-1.turso.io`
- Schema created, all 4 tables seeded (projects=3, writing=3, publications=4, speaking=1)
- `.env` populated with real credentials (gitignored)
- `src/lib/turso.ts` singleton created
- Netlify adapter installed (`@astrojs/netlify`)
- Remaining: manually add env vars to Netlify dashboard before first deploy

---

## Phase 1 — Foundation & Navigation ✅ DONE

- `Layout.astro` updated: Navbar, SEO props, JSON-LD Person schema
- `Navbar.astro` created: authority-funnel links, hamburger, sticky + backdrop-blur, active state

---

## Phase 1.5 — Animation Infrastructure

**Package:** `tailwind-animations` (`pnpm add tailwind-animations`)

**Setup (Tailwind v4 CSS-first):**
```css
/* src/styles/starwind.css — add after existing @imports */
@plugin 'tailwind-animations';
```

**Strategy:** CSS scroll-driven animations as primary mechanism. Intersection Observer as progressive enhancement for browsers without scroll-driven animation support.

### Animation Map per Section

| Section | Animation | Trigger |
|---|---|---|
| Hero headline | `animate-fade-in-down` | On load (no scroll) |
| Hero subtext | `animate-fade-in-up` | On load, 200ms delay |
| Hero CTA buttons | `animate-fade-in-up` | On load, 400ms delay |
| Logo strip items | `animate-fade-in-up` | Scroll, stagger 100ms |
| Page section headings | `animate-fade-in-down` | Scroll |
| Project cards | `animate-fade-in-up` | Scroll, stagger 150ms per card |
| Speaking module list items | `animate-slide-in-left` | Scroll, stagger 80ms |
| Writing article cards | `animate-fade-in-up` | Scroll, stagger 120ms |
| Publication journal cards | `animate-fade-in-up` | Scroll, stagger 120ms |
| Contact form fields | `animate-fade-in-up` | Scroll, stagger 100ms |

### Intersection Observer Helper (`src/lib/scroll-animate.ts`)

A tiny (<30 line) vanilla TS utility that:
1. Queries all `[data-scroll-animate]` elements
2. Uses `IntersectionObserver` with `threshold: 0.1`
3. Adds CSS class `is-visible` when element enters viewport
4. Removes the invisible state (elements start opacity-0, translate-y-4)

```ts
// Usage in Astro component:
// <div data-scroll-animate class="opacity-0 translate-y-4 transition-all duration-700">
//   content
// </div>
```

The `<script>` initializing the observer is added globally in `Layout.astro`.

### Stagger Delay Utilities (added to `starwind.css`)

```css
@theme {
  --animate-delay-100: 100ms;
  --animate-delay-200: 200ms;
  --animate-delay-300: 300ms;
  --animate-delay-400: 400ms;
  --animate-delay-500: 500ms;
}
```

Classes: `[animation-delay:100ms]`, `[animation-delay:200ms]`, etc. via Tailwind arbitrary values.

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  [data-scroll-animate],
  .animate-fade-in-up,
  .animate-fade-in-down,
  .animate-slide-in-left {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

---

## Phase 2 — Home Page (Brand Identity)

### 2.1 Hero Section (`Hero.astro`)
- **Typewriter effect** cycling through:
  1. `AI & Automation Architect`
  2. `GenAI Curriculum Specialist`
  3. `Top Tech Content Creator`
- Implementation: vanilla JS `setInterval`, no external lib
- **Name headline:** `Hi, I'm Rachmawati Ari Taurisia`
- **Hero statement:**
  > "I help professionals and businesses stop repeating and start automating. As an AI & Automation Curriculum Architect, I design intelligent learning paths and production-ready n8n workflows that integrate GenAI into daily productivity."

### 2.2 CTA Buttons
- **Primary:** `[View My Automation Blueprints]` → `/projects`
- **Secondary:** `[Subscribe to My Insights]` → `/writing`
- Starwind UI Button component

### 2.3 Social Proof Logo Strip (`LogoStrip.astro`)
- Label: _"Featured In & Collaborated With"_
- Logos (grayscale, opacity 60%, hover to full color): Google Cloud, SMKDEV, EUDEKA, WomenTech Network
- Store SVGs in `src/assets/logos/`

---

## Phase 3 — Projects Page (Proof of Work)

### 3.1 Turso Query Pattern
In `src/pages/projects/index.astro` frontmatter:
```ts
import { turso } from "@/lib/turso";
const { rows } = await turso.execute("SELECT * FROM projects ORDER BY id ASC");
const projects = rows.map(r => ({
  ...r,
  stack: JSON.parse(r.stack as string) as string[],
}));
```

### 3.2 ProjectCard Component (`ProjectCard.astro`)
Each card:
1. `<Image>` from `astro:assets` for workflow screenshot — WebP optimized, LCP-friendly
2. Title + description ("Production-Ready Blueprint used in Professional Workshops")
3. Tech stack tag badges
4. `[View Blueprint Structure]` button → toggles `<BlueprintViewer />`

### 3.3 BlueprintViewer Component
- `<pre><code>` with Shiki syntax highlighting (built into Astro — no React lib needed)
- JS toggle open/close

> **Security:** `blueprint_snippet` in DB must contain only structural JSON. No API keys, webhook URLs, Telegram/Gmail tokens. Verify before seeding.

---

## Phase 4 — Speaking Page (Educational Authority)

### 4.1 Turso Query
```ts
const { rows } = await turso.execute("SELECT * FROM speaking ORDER BY event_date DESC");
```

### 4.2 UI
- "Featured Commercial Workshop" badge
- EUDEKA + SMKDEV logos (prominent)
- Workshop meta, description, module list
- CTA: `[View Workshop Details]` → `https://goakal.com/smkdev/productivity-workflow-automation-ai-assistant`

### 4.3 JSON-LD `Course` Schema (in speaking page `<head>`)

---

## Phase 5 — Writing Page (Thought Leadership)

### 5.1 Turso Query
```ts
const { rows } = await turso.execute("SELECT * FROM writing ORDER BY published_date DESC");
```

### 5.2 Writing Card UI
- Category badge, title + description, external LinkedIn newsletter link

---

## Phase 6 — Publications Page (Academic Authority)

### 6.1 Turso Query
```ts
const { rows } = await turso.execute("SELECT * FROM publications ORDER BY published_date DESC");
```

### 6.2 UI
- Journal cards: title, date, abstract, DOI link
- Citations subsection for UIN & STAIDDI references

---

## Phase 7 — Contact Page (Server-Rendered)

```ts
// contact.astro frontmatter
export const prerender = false; // opt out of prerendering → SSR on Netlify
```
- Netlify Forms: add `netlify` attribute to `<form>` and `data-netlify="true"` — Netlify handles submission, no backend code needed
- Direct links: LinkedIn, Email

---

## Phase 8 — SEO & Performance

- Per-page `<SEO>` with unique title + description (passed as props to `Layout.astro`)
- `Person` schema global (done), `Course` schema on speaking page
- All screenshots via `<Image>` from `astro:assets`
- Mobile hamburger: done in Navbar.astro
- Netlify Image CDN: enabled by default in `@astrojs/netlify` adapter

---

## Technical Decisions & Constraints

| Decision | Rationale |
|---|---|
| **Hybrid output, not full SSR** | Content pages prerender at build time = instant CDN delivery, no Turso queries in prod traffic. Contact page needs SSR for Netlify Forms. |
| **Turso as build-time CMS** | Queried only during `astro build`. Content updates = redeploy (Netlify CI). Simpler than a full CMS, no runtime DB latency. |
| **`@libsql/client/web` import** | Required for Turso in non-Node environments (Netlify Edge). Use the `/web` subpath. |
| **Netlify Forms, not Formspree** | Native to Netlify hosting, zero config, no third-party dependency. |
| **Astro `<Image>` not `next/image`** | This is Astro 6. `astro:assets` + Netlify Image CDN = equivalent LCP optimization. |
| **Shiki not `react-syntax-highlighter`** | Built into Astro — no React dependency needed. |
| **Vanilla JS typewriter** | No external lib for simple text cycling. |
| **Starwind UI components** | Use `starwind add` MCP tool to install Button, Card, Badge as needed. |
| **`tailwind-animations` + IntersectionObserver** | CSS-first scroll animations with `@plugin 'tailwind-animations'` in Tailwind v4. IntersectionObserver as JS fallback. No animation library with runtime overhead. |
| **Scroll-triggered via `data-scroll-animate`** | Elements start invisible (`opacity-0 translate-y-4`); observer adds `is-visible` class on viewport entry. Stagger via inline `animation-delay` arbitrary values. |

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `TURSO_DATABASE_URL` | `.env` + Netlify dashboard | libsql:// connection URL |
| `TURSO_AUTH_TOKEN` | `.env` + Netlify dashboard | DB access token (never expose to client) |

---

## Out of Scope (V2.0)

- Authentication / user accounts
- Real-time data (Turso is build-time only)
- Admin UI for content management (edit data via Turso CLI or Turso dashboard)

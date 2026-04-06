# QWEN.md

This file provides guidance to Qwen Code when working with code in this repository.

## Commands

```bash
bun dev        # Start dev server (localhost:4321)
bun run build  # Build for production
bun run check  # Biome: format + lint + imports check
bun run lint   # Biome: lint only
bun run format # Biome: format only
```

### ⚠️ MANDATORY: Run Biome Before Completing Tasks

**Before finishing ANY task, you MUST:**
1. Run `bun run check` to verify code quality
2. Fix any errors or warnings reported
3. Ensure the command passes with no errors

Use `bun run check` — not `pnpm` or `npm`. This project uses `bun` as the package manager and runtime for Biome.

## Architecture

This is an **Astro 6** portfolio site for Rachmawati Ari Taurisia (`porto-ibu`), using:

- **Astro** with strict TypeScript — path alias `@/` maps to `src/`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.*` file — config is CSS-native in `src/styles/starwind.css`)
- **Starwind UI** component system — components go in `src/components/`, utilities in `src/lib/utils/`. Add components via `starwind add <component>` (MCP tool available)
- **astro-icon** for Tabler icons (`@tabler/icons`)
- **astro-seo** for `<SEO>` in `Layout.astro`
- **Partytown** integration for offloading third-party scripts
- **Biome v2.4** for formatting and linting

### Key files

- `src/styles/starwind.css` — global CSS entry point; defines the full design token system (CSS variables for colors, radius, dark mode via `.dark` class)
- `src/layouts/Layout.astro` — root HTML shell; imports global styles and SEO component
- `biome.json` — Biome configuration (formatting, linting, import organization)
- `starwind.config.json` — Starwind component registry config (tracks installed components)

### Styling conventions

Colors use semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.) defined as CSS variables — avoid raw Tailwind color classes like `bg-neutral-950`. Dark mode is class-based (`.dark`), not media-query-based.

## Documentation

All about project documentation is available in this folder `docs/`

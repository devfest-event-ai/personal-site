# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (localhost:4321)
pnpm build      # Build for production
pnpm preview    # Preview production build
```

## Architecture

This is an **Astro 6** portfolio site for Rachmawati Ari Tauirisia (`porto-ibu`), using:

- **Astro** with strict TypeScript — path alias `@/` maps to `src/`
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.*` file — config is CSS-native in `src/styles/starwind.css`)
- **Starwind UI** component system — components go in `src/components/`, utilities in `src/lib/utils/`. Add components via `starwind add <component>` (MCP tool available)
- **astro-icon** for Tabler icons (`@tabler/icons`)
- **astro-seo** for `<SEO>` in `Layout.astro`
- **Partytown** integration for offloading third-party scripts

### Key files

- `src/styles/starwind.css` — global CSS entry point; defines the full design token system (CSS variables for colors, radius, dark mode via `.dark` class)
- `src/layouts/Layout.astro` — root HTML shell; imports global styles and SEO component
- `starwind.config.json` — Starwind component registry config (tracks installed components)

### Styling conventions

Colors use semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.) defined as CSS variables — avoid raw Tailwind color classes like `bg-neutral-950`. Dark mode is class-based (`.dark`), not media-query-based.

## Documentation
all about project documentation is available in this folder 'docs/' 
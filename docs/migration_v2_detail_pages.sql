-- Migration: Add columns for detail pages
-- Run: turso db shell porto-ibu < docs/migration_v2_detail_pages.sql

-- ── Writing Table: Add columns for full article support ──────────────────────
ALTER TABLE writing ADD COLUMN slug TEXT;
ALTER TABLE writing ADD COLUMN content TEXT;
ALTER TABLE writing ADD COLUMN cover_image TEXT;
ALTER TABLE writing ADD COLUMN reading_time INTEGER;
ALTER TABLE writing ADD COLUMN tags TEXT;
ALTER TABLE writing ADD COLUMN is_external INTEGER DEFAULT 0;

-- ── Publications Table: Add slug for routing ────────────────────────────────
ALTER TABLE publications ADD COLUMN slug TEXT;

-- ── Speaking Table: Add slug for routing ────────────────────────────────────
ALTER TABLE speaking ADD COLUMN slug TEXT;

-- ── Backfill slugs for existing data ────────────────────────────────────────
-- Generate slugs from titles (lowercase, replace spaces with hyphens, remove special chars)
UPDATE writing SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;
UPDATE publications SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;
UPDATE speaking SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;

-- Ensure all slugs are unique by appending id if needed
UPDATE writing SET slug = slug || '-' || id WHERE id IN (
  SELECT id FROM writing WHERE slug IN (
    SELECT slug FROM writing GROUP BY slug HAVING COUNT(*) > 1
  )
);
UPDATE publications SET slug = slug || '-' || id WHERE id IN (
  SELECT id FROM publications WHERE slug IN (
    SELECT slug FROM publications GROUP BY slug HAVING COUNT(*) > 1
  )
);
UPDATE speaking SET slug = slug || '-' || id WHERE id IN (
  SELECT id FROM speaking WHERE slug IN (
    SELECT slug FROM speaking GROUP BY slug HAVING COUNT(*) > 1
  )
);

-- ── Indexes for performance ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_writing_slug ON writing(slug);
CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug);
CREATE INDEX IF NOT EXISTS idx_speaking_slug ON speaking(slug);

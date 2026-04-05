-- Migration: Add columns for detail pages
-- Run: turso db shell racharta-portfolio < docs/migration_v2_detail_pages.sql

-- ── Writing Table: Add columns for full article support ──────────────────────
ALTER TABLE writing ADD COLUMN slug TEXT UNIQUE;
ALTER TABLE writing ADD COLUMN content TEXT; -- Tiptap JSON content
ALTER TABLE writing ADD COLUMN cover_image TEXT; -- Hero image URL
ALTER TABLE writing ADD COLUMN reading_time INTEGER; -- Estimated minutes
ALTER TABLE writing ADD COLUMN tags TEXT; -- JSON array: '["n8n","AI","Automation"]'
ALTER TABLE writing ADD COLUMN is_external INTEGER DEFAULT 0; -- 0=internal, 1=LinkedIn

-- ── Publications Table: Add slug for routing ────────────────────────────────
ALTER TABLE publications ADD COLUMN slug TEXT UNIQUE;

-- ── Speaking Table: Add slug for routing ────────────────────────────────────
ALTER TABLE speaking ADD COLUMN slug TEXT UNIQUE;

-- ── Indexes for performance ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_writing_slug ON writing(slug);
CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug);
CREATE INDEX IF NOT EXISTS idx_speaking_slug ON speaking(slug);

-- ── Backfill slugs for existing data ────────────────────────────────────────
-- Generate slugs from titles (lowercase, replace spaces with hyphens, remove special chars)
UPDATE writing SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;
UPDATE publications SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;
UPDATE speaking SET slug = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', '')) WHERE slug IS NULL;

-- Ensure all slugs are unique by appending id if needed
UPDATE writing SET slug = slug || '-' || id WHERE slug IN (SELECT slug FROM writing GROUP BY slug HAVING COUNT(*) > 1);
UPDATE publications SET slug = slug || '-' || id WHERE slug IN (SELECT slug FROM publications GROUP BY slug HAVING COUNT(*) > 1);
UPDATE speaking SET slug = slug || '-' || id WHERE slug IN (SELECT slug FROM speaking GROUP BY slug HAVING COUNT(*) > 1);

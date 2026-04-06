-- Performance indexes for porto-ibu database
-- Run this migration to improve query performance

-- Slug index for projects table (only table with slug column)
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Date indexes for ORDER BY clauses
CREATE INDEX IF NOT EXISTS idx_writing_published_date ON writing(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_publications_published_date ON publications(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_speaking_event_date ON speaking(event_date DESC);

-- Email index for contact form rate limiting
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);

-- ID indexes for faster lookups (if not already indexed by PRIMARY KEY)
CREATE INDEX IF NOT EXISTS idx_writing_id ON writing(id);
CREATE INDEX IF NOT EXISTS idx_speaking_id ON speaking(id);
CREATE INDEX IF NOT EXISTS idx_publications_id ON publications(id);

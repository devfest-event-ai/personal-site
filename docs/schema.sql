-- Portfolio V2.0 — Turso Database Schema
-- Run: turso db shell racharta-portfolio < docs/schema.sql

CREATE TABLE IF NOT EXISTS projects (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT NOT NULL,
  json_source      TEXT NOT NULL,
  stack            TEXT NOT NULL,         -- JSON array: '["n8n","Gmail API"]'
  screenshot_url   TEXT NOT NULL,         -- e.g. '/workflows/invoice-tracker.png'
  blueprint_snippet TEXT NOT NULL         -- sanitized structural JSON only — NO credentials
);

CREATE TABLE IF NOT EXISTS writing (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title          TEXT NOT NULL,
  category       TEXT NOT NULL,           -- 'Strategy' | 'Technical Tutorial' | 'Analysis'
  description    TEXT NOT NULL,
  url            TEXT NOT NULL,
  published_date TEXT NOT NULL            -- ISO 8601: '2025-01-15'
);

CREATE TABLE IF NOT EXISTS publications (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title          TEXT NOT NULL,
  journal        TEXT NOT NULL,
  published_date TEXT NOT NULL,
  abstract       TEXT NOT NULL,
  doi_url        TEXT,
  type           TEXT NOT NULL            -- 'journal' | 'citation'
);

CREATE TABLE IF NOT EXISTS speaking (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  title        TEXT NOT NULL,
  provider     TEXT NOT NULL,
  event_date   TEXT NOT NULL,             -- ISO 8601: '2025-10-01'
  role         TEXT NOT NULL,
  description  TEXT NOT NULL,
  link         TEXT NOT NULL,
  modules      TEXT NOT NULL             -- JSON array: '[{"title":"...","desc":"..."}]'
);

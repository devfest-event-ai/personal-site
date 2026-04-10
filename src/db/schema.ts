import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ── Content tables ─────────────────────────────────────────────────────────

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  jsonSource: text("json_source").notNull(),
  stack: text("stack").notNull(),
  screenshotUrl: text("screenshot_url").notNull(),
});

export const writing = sqliteTable("writing", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  publishedDate: text("published_date").notNull(),
  content: text("content"),
  coverImage: text("cover_image"),
  readingTime: integer("reading_time"),
  tags: text("tags"),
  isExternal: integer("is_external").default(0),
});

export const publications = sqliteTable("publications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  journal: text("journal").notNull(),
  publishedDate: text("published_date").notNull(),
  abstract: text("abstract").notNull(),
  doiUrl: text("doi_url"),
  type: text("type").notNull(),
});

export const speaking = sqliteTable("speaking", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  provider: text("provider").notNull(),
  eventDate: text("event_date").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  link: text("link").notNull(),
  modules: text("modules").notNull(),
});

export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  value: text("value").notNull(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: text("submitted_at").notNull().default("(datetime('now'))"),
});

// ── Better Auth tables ─────────────────────────────────────────────────────

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

import { getSecret } from "astro:env/server";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

const url = getSecret("TURSO_DATABASE_URL") ?? "file:local.db";
const authToken = getSecret("TURSO_AUTH_TOKEN") ?? undefined;

export const db = drizzle({
  connection: { url, authToken },
  schema,
});

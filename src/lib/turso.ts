import { getSecret } from "astro:env/server";
import { createClient } from "@libsql/client";

function getClient() {
  const url = getSecret("TURSO_DATABASE_URL") ?? "file:local.db";
  const authToken = getSecret("TURSO_AUTH_TOKEN") ?? undefined;
  return createClient({ url, authToken });
}

export const turso = getClient();

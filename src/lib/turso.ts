import { createClient } from "@libsql/client";

function getClient() {
  const url =
    process.env.TURSO_DATABASE_URL ??
    (import.meta.env.TURSO_DATABASE_URL as string);
  const authToken =
    process.env.TURSO_AUTH_TOKEN ??
    (import.meta.env.TURSO_AUTH_TOKEN as string | undefined);
  return createClient({ url, authToken });
}

export const turso = getClient();

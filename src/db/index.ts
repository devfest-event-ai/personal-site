import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

// process.env: runtime (Netlify production, system env)
// import.meta.env: Vite dev server loads from .env file
const url =
  process.env.TURSO_DATABASE_URL ??
  (import.meta.env.TURSO_DATABASE_URL as string);

const authToken =
  process.env.TURSO_AUTH_TOKEN ??
  (import.meta.env.TURSO_AUTH_TOKEN as string | undefined);

export const db = drizzle({
  connection: { url, authToken },
  schema,
});

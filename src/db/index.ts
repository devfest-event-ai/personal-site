import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

export const db = drizzle({
  connection: {
    url: import.meta.env.TURSO_DATABASE_URL,
    authToken: import.meta.env.TURSO_AUTH_TOKEN,
  },
  schema,
});

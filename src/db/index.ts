import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

const url = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = drizzle({
  connection: { url, authToken },
  schema,
});

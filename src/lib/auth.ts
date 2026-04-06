import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import * as schema from "@/db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  secret:
    process.env.BETTER_AUTH_SECRET ??
    (import.meta.env.BETTER_AUTH_SECRET as string),
  baseURL:
    process.env.BETTER_AUTH_URL ??
    (import.meta.env.BETTER_AUTH_URL as string),

  socialProviders: {
    google: {
      clientId:
        process.env.GOOGLE_CLIENT_ID ??
        (import.meta.env.GOOGLE_CLIENT_ID as string),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        (import.meta.env.GOOGLE_CLIENT_SECRET as string),
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
});

export type Auth = typeof auth;

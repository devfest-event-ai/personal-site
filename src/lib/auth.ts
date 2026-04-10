import { getSecret } from "astro:env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import * as schema from "@/db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  secret: getSecret("BETTER_AUTH_SECRET")!,
  baseURL: getSecret("BETTER_AUTH_URL")!,

  socialProviders: {
    google: {
      clientId: getSecret("GOOGLE_CLIENT_ID")!,
      clientSecret: getSecret("GOOGLE_CLIENT_SECRET")!,
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

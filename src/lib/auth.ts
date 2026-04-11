import { getSecret } from "astro:env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import * as schema from "@/db/schema.js";

const secret = getSecret("BETTER_AUTH_SECRET");
const baseURL = getSecret("BETTER_AUTH_URL");
const googleClientId = getSecret("GOOGLE_CLIENT_ID");
const googleClientSecret = getSecret("GOOGLE_CLIENT_SECRET");

if (!secret) throw new Error("BETTER_AUTH_SECRET is not set");
if (!baseURL) throw new Error("BETTER_AUTH_URL is not set");
if (!googleClientId) throw new Error("GOOGLE_CLIENT_ID is not set");
if (!googleClientSecret) throw new Error("GOOGLE_CLIENT_SECRET is not set");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),

  secret,
  baseURL,

  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
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

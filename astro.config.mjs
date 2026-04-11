import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig, envField } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [icon(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      BETTER_AUTH_URL: envField.string({
        context: "server",
        access: "secret",
        default: "http://localhost:4321",
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CLIENT_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_SERVICE_ACCOUNT_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_DRIVE_FOLDER_ID: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      TURNSTILE_SITE_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
      GOOGLE_PICKER_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  adapter: netlify(),
});

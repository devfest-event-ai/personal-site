import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [icon(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});

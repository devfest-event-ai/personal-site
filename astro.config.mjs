import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import partytown from '@astrojs/partytown';

import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [icon(), partytown(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
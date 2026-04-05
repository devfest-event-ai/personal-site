import tailwindcss from "@tailwindcss/vite";
// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

import partytown from '@astrojs/partytown';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), partytown(), ],

  vite: {
      plugins: [tailwindcss()],
	},

  adapter: netlify(),
});
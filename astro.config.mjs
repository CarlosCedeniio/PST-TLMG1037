// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://carloscedeniio.github.io',
  base: '/PST-TLMG1037',
  trailingSlash: 'ignore',
  // reveal.js + highlight.js pesan ~900 kB, pero solo se cargan en las diapositivas.
  vite: { build: { chunkSizeWarningLimit: 1200 } },
});

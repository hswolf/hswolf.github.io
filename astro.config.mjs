import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vinh.to',
  integrations: [
    mdx(),
    // /japanese/n3/ is a hidden page: keep it out of the sitemap.
    sitemap({ filter: (page) => !page.includes('/japanese/n3/') }),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

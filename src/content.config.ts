import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  lang: z.enum(['vi', 'en']).default('vi'),
  draft: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: postSchema,
});

const life = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/life' }),
  schema: postSchema,
});

const poetry = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/poetry' }),
  schema: postSchema.omit({ heroImage: true }).extend({
    subtitle: z.string().optional(),
  }),
});

export const collections = { blog, life, poetry };

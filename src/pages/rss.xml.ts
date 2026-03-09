import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog', ({ data }) => !data.draft);
  const life = await getCollection('life', ({ data }) => !data.draft);
  const poetry = await getCollection('poetry', ({ data }) => !data.draft);

  const allPosts = [
    ...blog.map((p) => ({ ...p, collection: 'blog' as const })),
    ...life.map((p) => ({ ...p, collection: 'life' as const })),
    ...poetry.map((p) => ({ ...p, collection: 'poetry' as const })),
  ].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'vinh.to',
    description: 'Blog cá nhân của Vinh - code, cuộc sống, và thơ từ Đà Lạt',
    site: context.site!,
    items: allPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/${post.collection === 'poetry' ? 'tho' : post.collection}/${post.id}/`,
    })),
  });
}

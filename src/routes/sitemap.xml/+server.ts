import { getPosts } from '$lib/blog';
import { site } from '$lib/site';

export const prerender = true;

export function GET() {
	const pages = ['/', '/projects', '/blog', '/about'];
	const posts = getPosts().map((post) => ({
		path: `/blog/${post.slug}`,
		lastmod: post.date.slice(0, 10)
	}));

	const entries = [
		...pages.map((path) => ({ path, lastmod: undefined as string | undefined })),
		...posts
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(entry) =>
			`<url><loc>${site.url}${entry.path}</loc>${
				entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''
			}</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

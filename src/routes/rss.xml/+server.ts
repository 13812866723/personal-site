import { getPosts } from '$lib/blog';
import { site } from '$lib/site';

export const prerender = true;

const escapeXml = (value: string) =>
	value.replace(
		/[<>&'"]/g,
		(c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!
	);

export function GET() {
	const items = getPosts()
		.map(
			(post) => `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${site.url}/blog/${post.slug}</link>
  <guid isPermaLink="true">${site.url}/blog/${post.slug}</guid>
  <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  <description>${escapeXml(post.summary)}</description>
  ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n  ') ?? ''}
</item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(site.name)}</title>
<link>${site.url}</link>
<description>${escapeXml(site.description)}</description>
<language>zh-CN</language>
<atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel></rss>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}

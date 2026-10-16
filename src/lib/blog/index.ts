export interface PostMeta {
	title: string;
	date: string;
	summary: string;
	tags: string[];
	draft?: boolean;
}

export interface Post extends PostMeta {
	slug: string;
}

type Module = { metadata: PostMeta; default: unknown };

const modules = import.meta.glob<Module>('/src/content/posts/*.md', { eager: true });

export function getPosts(): Post[] {
	return Object.entries(modules)
		.map(([path, mod]) => ({
			slug: path.split('/').pop()!.replace(/\.md$/, ''),
			...mod.metadata
		}))
		.filter((p) => !p.draft && p.title && p.date)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string) {
	const entry = Object.entries(modules).find(([path]) => path.endsWith(`/${slug}.md`));
	if (!entry) return null;
	const [, mod] = entry;
	return { meta: { slug, ...mod.metadata } as Post, component: mod.default };
}

export function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString('zh-CN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

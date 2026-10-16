import { getPosts } from '$lib/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	const posts = getPosts();
	const tags = [...new Set(posts.flatMap((p) => p.tags ?? []))].sort();
	return { title: '文章', description: '技术笔记与随笔。', posts, tags };
};

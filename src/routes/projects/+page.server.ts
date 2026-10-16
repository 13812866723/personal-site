import { fetchRepos } from '$lib/github';
import { site } from '$lib/site';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const repos = await fetchRepos(fetch, site.handle).catch(() => []);
	const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[];
	return {
		title: '项目',
		description: `${site.name} 在 GitHub 上的公开项目。`,
		repos,
		languages
	};
};

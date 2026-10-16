import { getPosts } from '$lib/blog';
import { fetchRepos } from '$lib/github';
import { site } from '$lib/site';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	// A failed API call must not break the build; the page degrades to no repos.
	const repos = await fetchRepos(fetch, site.handle).catch(() => []);
	return {
		posts: getPosts().slice(0, 3),
		recent: repos.slice(0, 4),
		stats: {
			repos: repos.length,
			stars: repos.reduce((n, r) => n + r.stargazers_count, 0)
		}
	};
};

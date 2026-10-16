export interface GhRepo {
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	pushed_at: string;
	fork: boolean;
	archived: boolean;
	topics: string[];
}

/**
 * Reads the public repository list at build time. Pages that call this are
 * prerendered, so it runs once per deploy rather than on every request.
 *
 * Set GITHUB_TOKEN to raise the anonymous rate limit. The token is read only
 * during the build and never reaches the client bundle.
 */
export async function fetchRepos(fetchFn: typeof fetch, user: string): Promise<GhRepo[]> {
	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	const token = process.env.GITHUB_TOKEN;
	if (token) headers.Authorization = `Bearer ${token}`;

	const out: GhRepo[] = [];
	for (let page = 1; page <= 3; page++) {
		const res = await fetchFn(
			`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&page=${page}`,
			{ headers }
		);
		if (!res.ok) break;
		const batch = (await res.json()) as GhRepo[];
		out.push(...batch);
		if (batch.length < 100) break;
	}

	return out.filter((r) => !r.fork && !r.archived);
}

export function relativeTime(iso: string, now = Date.now()): string {
	const days = Math.floor((now - new Date(iso).getTime()) / 86_400_000);
	if (days <= 0) return 'today';
	if (days === 1) return '1d ago';
	if (days < 30) return `${days}d ago`;
	if (days < 365) return `${Math.floor(days / 30)}mo ago`;
	return `${Math.floor(days / 365)}y ago`;
}

/** GitHub language colours, with a neutral fallback for anything unmapped. */
const LANGUAGE_COLORS: Record<string, string> = {
	TypeScript: '#3178c6',
	JavaScript: '#f1e05a',
	Python: '#3572a5',
	Java: '#b07219',
	Kotlin: '#a97bff',
	'C#': '#178600',
	'C++': '#f34b7d',
	C: '#555555',
	Rust: '#dea584',
	Go: '#00add8',
	Svelte: '#ff3e00',
	Vue: '#41b883',
	HTML: '#e34c26',
	CSS: '#563d7c',
	Shell: '#89e051',
	GLSL: '#5686a5'
};

export function languageColor(language: string | null): string | null {
	if (!language) return null;
	return LANGUAGE_COLORS[language] ?? 'var(--color-muted)';
}

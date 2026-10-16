<script lang="ts">
	import RepoCard from '$lib/components/RepoCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let language = $state<string | null>(null);
	let query = $state('');

	const filtered = $derived(
		data.repos.filter(
			(r) =>
				(!language || r.language === language) &&
				(!query ||
					`${r.name} ${r.description ?? ''}`.toLowerCase().includes(query.toLowerCase()))
		)
	);
</script>

<section class="mx-auto max-w-4xl px-6 py-16">
	<h1 class="font-display text-4xl tracking-tight">项目</h1>
	<p class="mt-3 text-muted">
		构建时从 GitHub 拉取，共 {data.repos.length} 个非 fork 仓库。
	</p>

	<div class="mt-8 flex flex-wrap items-center gap-2">
		<label class="sr-only" for="repo-search">搜索仓库</label>
		<input
			id="repo-search"
			bind:value={query}
			placeholder="搜索…"
			class="w-48 rounded-sm border border-rule bg-surface px-3 py-1.5 font-mono text-sm outline-none transition-colors focus:border-accent"
		/>
		<button
			type="button"
			onclick={() => (language = null)}
			class="rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors {language === null
				? 'border-accent text-accent'
				: 'border-rule text-muted hover:border-accent'}"
		>all</button>
		{#each data.languages as lang}
			<button
				type="button"
				onclick={() => (language = language === lang ? null : lang)}
				class="rounded-sm border px-3 py-1.5 font-mono text-xs transition-colors {language === lang
					? 'border-accent text-accent'
					: 'border-rule text-muted hover:border-accent'}"
			>{lang}</button>
		{/each}
	</div>

	<p class="mt-4 font-mono text-xs text-muted">
		{filtered.length} / {data.repos.length}
	</p>

	<div class="mt-8 grid gap-4 md:grid-cols-2">
		{#each filtered as repo (repo.full_name)}
			<RepoCard {repo} />
		{:else}
			<p class="text-muted">没有匹配的仓库。</p>
		{/each}
	</div>
</section>

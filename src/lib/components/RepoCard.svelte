<script lang="ts">
	import { languageColor, relativeTime, type GhRepo } from '$lib/github';

	let { repo }: { repo: GhRepo } = $props();

	const color = $derived(languageColor(repo.language));
</script>

<a
	href={repo.html_url}
	target="_blank"
	rel="noopener noreferrer"
	class="group flex h-full flex-col rounded-sm border border-rule bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
>
	<h3 class="font-mono text-sm font-medium break-all">{repo.name}</h3>

	{#if repo.description}
		<p class="mt-2 flex-1 text-sm leading-relaxed text-muted">{repo.description}</p>
	{:else}
		<p class="mt-2 flex-1 text-sm italic text-muted/70">暂无描述</p>
	{/if}

	<div class="mt-4 flex items-center gap-4 font-mono text-xs text-muted">
		{#if repo.language && color}
			<span class="flex items-center gap-1.5">
				<span class="inline-block size-2.5 rounded-full" style="background:{color}"></span>
				{repo.language}
			</span>
		{/if}
		{#if repo.stargazers_count > 0}
			<span>&#9733; {repo.stargazers_count}</span>
		{/if}
		<span class="ml-auto">{relativeTime(repo.pushed_at)}</span>
	</div>
</a>

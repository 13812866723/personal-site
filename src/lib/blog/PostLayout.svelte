<script lang="ts">
	import { formatDate } from '$lib/blog';
	import type { Snippet } from 'svelte';

	let {
		title,
		date,
		summary,
		tags = [],
		children
	}: {
		title: string;
		date: string;
		summary?: string;
		tags?: string[];
		children: Snippet;
	} = $props();
</script>

<article class="mx-auto max-w-3xl px-6 py-16">
	<header class="border-b border-rule pb-8">
		<p class="font-mono text-xs uppercase tracking-widest text-muted">
			<time datetime={date}>{formatDate(date)}</time>
		</p>
		<h1 class="mt-3 font-display text-3xl leading-tight tracking-tight md:text-4xl">{title}</h1>
		{#if summary}
			<p class="mt-4 text-lg leading-relaxed text-muted">{summary}</p>
		{/if}
		{#if tags.length}
			<ul class="mt-5 flex flex-wrap gap-2 text-xs">
				{#each tags as tag}
					<li>
						<a
							href="/blog?tag={tag}"
							class="rounded-full border border-rule px-2.5 py-0.5 font-mono text-muted transition-colors hover:border-accent hover:text-accent"
						>#{tag}</a>
					</li>
				{/each}
			</ul>
		{/if}
	</header>

	<div class="prose prose-lg mt-10 max-w-none">
		{@render children()}
	</div>

	<nav class="mt-14 border-t border-rule pt-6">
		<a class="font-mono text-sm text-muted transition-colors hover:text-accent" href="/blog">
			&larr; 全部文章
		</a>
	</nav>
</article>

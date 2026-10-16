<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { formatDate } from '$lib/blog';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Tag filtering stays client-side so every post is present in the
	// prerendered HTML for crawlers.
	const tag = $derived(browser ? page.url.searchParams.get('tag') : null);
	const posts = $derived(tag ? data.posts.filter((p) => p.tags?.includes(tag)) : data.posts);
</script>

<section class="mx-auto max-w-3xl px-6 py-16">
	<h1 class="font-display text-4xl tracking-tight">文章</h1>
	<p class="mt-3 text-muted">技术笔记、踩坑记录，以及不知道该放哪的东西。</p>

	{#if data.tags.length}
		<ul class="mt-8 flex flex-wrap gap-2 text-xs">
			<li>
				<a
					href="/blog"
					class="rounded-full border px-3 py-0.5 font-mono {tag
						? 'border-rule text-muted'
						: 'border-accent text-accent'}"
				>all</a>
			</li>
			{#each data.tags as t}
				<li>
					<a
						href="/blog?tag={t}"
						class="rounded-full border px-3 py-0.5 font-mono {tag === t
							? 'border-accent text-accent'
							: 'border-rule text-muted hover:border-accent'}"
					>#{t}</a>
				</li>
			{/each}
		</ul>
	{/if}

	<ul class="mt-12 divide-y divide-rule border-t border-rule">
		{#each posts as post}
			<li>
				<a class="group block py-7" href="/blog/{post.slug}">
					<time class="font-mono text-xs text-muted" datetime={post.date}>
						{formatDate(post.date)}
					</time>
					<h2
						class="mt-1.5 font-display text-2xl leading-tight transition-colors group-hover:text-accent"
					>
						{post.title}
					</h2>
					<p class="mt-2 text-sm leading-relaxed text-muted">{post.summary}</p>
				</a>
			</li>
		{:else}
			<li class="py-7 text-muted">还没有文章。</li>
		{/each}
	</ul>
</section>

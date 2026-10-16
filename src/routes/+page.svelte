<script lang="ts">
	import { formatDate } from '$lib/blog';
	import { featured, links, now, site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const featuredHref = (repo: string) =>
		repo.startsWith('http') ? repo : `https://github.com/${repo}`;
</script>

<svelte:head>
	<script type="application/ld+json">
		{JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: site.name,
			url: site.url,
			email: `mailto:${site.email}`,
			sameAs: [site.github]
		})}
	</script>
</svelte:head>

<!-- Hero: oversized serif display type against a masked drafting grid. -->
<section class="relative isolate overflow-hidden border-b border-rule/70">
	<div class="grid-field pointer-events-none absolute inset-0 -z-10" aria-hidden="true"></div>

	<div class="mx-auto max-w-4xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
		<p class="rise font-mono text-xs uppercase tracking-[0.25em] text-accent" style="--rise-delay:0ms">
			{site.location}
		</p>

		<h1
			class="rise mt-5 font-display text-5xl leading-[0.95] tracking-tight md:text-7xl"
			style="--rise-delay:80ms"
		>
			{site.name}
		</h1>

		<p
			class="rise mt-6 max-w-xl text-lg leading-relaxed text-muted"
			style="--rise-delay:160ms"
		>
			{site.description}
		</p>

		<ul class="rise mt-9 flex flex-wrap gap-x-7 gap-y-3" style="--rise-delay:240ms">
			{#each links as link}
				<li>
					<a
						href={link.href}
						target={link.href.startsWith('mailto:') ? undefined : '_blank'}
						rel="noopener noreferrer"
						class="group flex items-baseline gap-2"
					>
						<span class="text-sm font-medium underline-grow pb-0.5">{link.label}</span>
						<span class="font-mono text-xs text-muted transition-colors group-hover:text-accent">
							{link.note}
						</span>
					</a>
				</li>
			{/each}
		</ul>

		<!-- Numerals set large and loose so the hero reads as a masthead. -->
		<dl
			class="rise mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-rule/70 pt-8"
			style="--rise-delay:320ms"
		>
			<div>
				<dt class="font-mono text-xs uppercase tracking-widest text-muted">repositories</dt>
				<dd class="mt-1 font-display text-3xl">{data.stats.repos}</dd>
			</div>
			<div>
				<dt class="font-mono text-xs uppercase tracking-widest text-muted">stars earned</dt>
				<dd class="mt-1 font-display text-3xl">{data.stats.stars}</dd>
			</div>
			<div>
				<dt class="font-mono text-xs uppercase tracking-widest text-muted">writing</dt>
				<dd class="mt-1 font-display text-3xl">{data.posts.length}</dd>
			</div>
		</dl>
	</div>
</section>

{#if now.length}
	<section class="mx-auto max-w-4xl px-6 py-16">
		<h2 class="font-mono text-xs uppercase tracking-[0.25em] text-muted">Now</h2>
		<ul class="mt-8 divide-y divide-rule">
			{#each now as item}
				<li class="grid gap-1 py-5 md:grid-cols-[10rem_1fr] md:gap-8">
					<h3 class="font-medium">{item.title}</h3>
					<p class="text-sm leading-relaxed text-muted">{item.detail}</p>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if featured.length}
	<section class="border-y border-rule/70 bg-surface/50">
		<div class="mx-auto max-w-4xl px-6 py-16">
			<div class="flex items-baseline justify-between gap-4">
				<h2 class="font-mono text-xs uppercase tracking-[0.25em] text-muted">Selected work</h2>
				<a class="text-sm text-accent underline-grow" href="/projects">全部项目</a>
			</div>

			<ul class="mt-8 divide-y divide-rule">
				{#each featured as item}
					<li>
						<a
							href={featuredHref(item.repo)}
							target="_blank"
							rel="noopener noreferrer"
							class="group grid gap-2 py-6 md:grid-cols-[16rem_1fr] md:gap-8"
						>
							<div>
								<h3
									class="font-display text-2xl leading-tight transition-colors group-hover:text-accent"
								>
									{item.name}
								</h3>
								<p class="mt-1 font-mono text-xs text-muted">{item.tag}</p>
							</div>
							<p class="text-sm leading-relaxed text-muted md:pt-1.5">{item.desc}</p>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

{#if data.recent.length}
	<section class="mx-auto max-w-4xl px-6 py-16">
		<h2 class="font-mono text-xs uppercase tracking-[0.25em] text-muted">Recently pushed</h2>
		<ul class="mt-8 grid gap-x-10 gap-y-1 md:grid-cols-2">
			{#each data.recent as repo}
				<li>
					<a
						href={repo.html_url}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-baseline justify-between gap-4 border-b border-rule/70 py-3"
					>
						<span class="font-mono text-sm break-all transition-colors group-hover:text-accent">
							{repo.name}
						</span>
						{#if repo.language}
							<span class="shrink-0 font-mono text-xs text-muted">{repo.language}</span>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if data.posts.length}
	<section class="border-t border-rule/70 bg-surface/50">
		<div class="mx-auto max-w-4xl px-6 py-16">
			<div class="flex items-baseline justify-between gap-4">
				<h2 class="font-mono text-xs uppercase tracking-[0.25em] text-muted">Writing</h2>
				<a class="text-sm text-accent underline-grow" href="/blog">全部文章</a>
			</div>

			<ul class="mt-8 divide-y divide-rule">
				{#each data.posts as post}
					<li>
						<a class="group block py-6" href="/blog/{post.slug}">
							<time class="font-mono text-xs text-muted" datetime={post.date}>
								{formatDate(post.date)}
							</time>
							<h3
								class="mt-1.5 font-display text-2xl leading-tight transition-colors group-hover:text-accent"
							>
								{post.title}
							</h3>
							<p class="mt-2 max-w-prose text-sm leading-relaxed text-muted">{post.summary}</p>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

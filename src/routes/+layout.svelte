<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { site } from '$lib/site';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const nav = [
		{ href: '/', label: '首页' },
		{ href: '/projects', label: '项目' },
		{ href: '/blog', label: '文章' },
		{ href: '/about', label: '关于' }
	];

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<svelte:head>
	<title>{page.data.title ? `${page.data.title} · ${site.name}` : site.title}</title>
	<meta name="description" content={page.data.description ?? site.description} />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:title" content={page.data.title ?? site.title} />
	<meta property="og:description" content={page.data.description ?? site.description} />
	<meta property="og:url" content={site.url + page.url.pathname} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href={site.url + page.url.pathname} />
</svelte:head>

<div class="flex min-h-dvh flex-col">
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-paper"
	>跳到正文</a>

	<header class="border-b border-rule/70">
		<nav
			class="mx-auto flex max-w-4xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-5"
			aria-label="主导航"
		>
			<a href="/" class="font-display text-lg tracking-tight">
				{site.name}
			</a>
			<ul class="order-last flex w-full gap-x-5 gap-y-2 text-sm sm:order-none sm:ml-auto sm:w-auto">
				{#each nav as item}
					<li>
						<a
							href={item.href}
							aria-current={isActive(item.href) ? 'page' : undefined}
							class="underline-grow pb-0.5 transition-colors {isActive(item.href)
								? 'text-accent'
								: 'text-muted hover:text-ink'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main id="main" class="flex-1">
		{@render children()}
	</main>

	<footer class="mt-20 border-t border-rule/70">
		<div
			class="mx-auto flex max-w-4xl flex-col gap-2 px-6 py-10 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="m-0">
				&copy; {new Date().getFullYear()} {site.name}
			</p>
			<p class="m-0 flex flex-wrap gap-x-4 gap-y-1">
				<a class="underline-grow hover:text-ink" href={site.github}>GitHub</a>
				<a class="underline-grow hover:text-ink" href={`mailto:${site.email}`}>Email</a>
				<a class="underline-grow hover:text-ink" href="/rss.xml">RSS</a>
				<a class="underline-grow hover:text-ink" href="/sitemap.xml">Sitemap</a>
			</p>
		</div>
	</footer>
</div>

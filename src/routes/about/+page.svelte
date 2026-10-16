<script lang="ts">
	import { site } from '$lib/site';

	const facts = [
		{ label: 'Based in', value: site.location },
		{ label: 'Email', value: site.email, href: `mailto:${site.email}` },
		{ label: 'GitHub', value: `@${site.handle}`, href: site.github }
	];
</script>

<svelte:head>
	<title>关于 · {site.name}</title>
	<meta name="description" content={`关于 ${site.name}。`} />
</svelte:head>

<section class="mx-auto max-w-3xl px-6 py-16">
	<h1 class="font-display text-4xl tracking-tight">关于</h1>

	<div class="prose prose-lg mt-8 max-w-none">
		<p>
			这里写你的自我介绍。两三段就够：你在做什么方向、做过哪些值得一提的事、现在最想解决什么问题。
		</p>
		<p>
			想加联系方式、经历、技能列表，都可以直接在这段 markdown 里加。这个页面是普通的
			Svelte 组件，想改成结构化列表也很容易。
		</p>
	</div>

	<dl class="mt-12 divide-y divide-rule border-y border-rule">
		{#each facts as fact}
			<div class="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
				<dt class="font-mono text-xs uppercase tracking-widest text-muted">{fact.label}</dt>
				<dd class="m-0 text-sm">
					{#if fact.href}
						<a class="text-accent underline-grow" href={fact.href}>{fact.value}</a>
					{:else}
						{fact.value}
					{/if}
				</dd>
			</div>
		{/each}
	</dl>
</section>

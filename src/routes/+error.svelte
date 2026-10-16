<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="mx-auto max-w-4xl px-6 py-24">
	<p class="font-mono text-sm text-accent">{page.status}</p>
	<h1 class="mt-3 font-display text-4xl tracking-tight">这里没有内容</h1>
	<p class="mt-4 max-w-prose text-muted">{page.error?.message ?? '页面不存在或已被移动。'}</p>
	<a class="mt-8 inline-block text-sm text-accent underline-grow" href="/">返回首页</a>
</section>

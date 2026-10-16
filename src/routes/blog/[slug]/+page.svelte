<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// mdsvex attaches its layout to the compiled component, so rendering it
	// here is enough to produce the whole article.
	const Post = $derived(data.component as any);
</script>

<Post {...data.meta} />

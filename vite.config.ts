import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { createHighlighter } from 'shiki';

// Build-time syntax highlighting keeps zero highlighter JS in the client bundle.
const highlighter = await createHighlighter({
	themes: ['vesper'],
	langs: [
		'c', 'cpp', 'csharp', 'java', 'kotlin', 'python', 'typescript', 'javascript',
		'svelte', 'vue', 'tsx', 'jsx', 'glsl', 'groovy', 'bash', 'powershell', 'json',
		'yaml', 'toml', 'dockerfile', 'markdown', 'html', 'css', 'sql', 'diff', 'rust', 'go'
	]
});

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: [
				mdsvex({
					extensions: ['.md'],
					layout: {
						_: fileURLToPath(new URL('./src/lib/blog/PostLayout.svelte', import.meta.url))
					},
					rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]] as never,
					highlight: {
						highlighter: (code: string, lang?: string | null) => {
							const language =
								lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
							const html = highlighter.codeToHtml(code, { lang: language, theme: 'vesper' });
							return `{@html ${JSON.stringify(html)}}`;
						}
					}
				})
			],
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.md')
						? undefined
						: true
			},
			adapter: adapter({ runtime: 'nodejs22.x' }),
			prerender: { entries: ['*'], handleHttpError: 'warn' }
		})
	]
});

---
title: 从零搭建这个站点
date: 2026-10-15
summary: SvelteKit 预渲染 + Tailwind v4 主题变量 + mdsvex 写 Markdown + Vercel 托管。没有数据库，也没有运行时服务器。
tags: [meta, svelte]
---

这个站点整个是静态的：`vite build` 之后，每一页都是构建期生成好的 HTML，部署到 Vercel 的 CDN 上。这篇文章记录它由哪些部分组成。

## 技术选型

- **SvelteKit 2**：用文件路由，`prerender = true` 让所有页面在构建期就渲染成 HTML。
- **Tailwind CSS v4**：主题色写在 `app.css` 的 `@theme` 块里，亮色/暗色只改一组 CSS 变量。
- **mdsvex**：把 `src/content/posts/*.md` 编译成 Svelte 组件，代码高亮在构建期用 Shiki 完成。
- **Vercel**：连接 GitHub 仓库，每次 push 自动构建部署。

## 写一篇新文章

在 `src/content/posts/` 里新建一个 `.md` 文件，头部加上 frontmatter：

```markdown
---
title: 文章标题
date: 2026-10-15
summary: 一句话摘要，会出现在列表页和 RSS 里。
tags: [svelte, notes]
---

正文从这里开始。
```

文件名就是 URL，比如 `hello.md` 对应 `/blog/hello`。列表页、RSS 和 sitemap 都会自动包含它，不需要注册。

想写草稿又不想发布，加上 `draft: true` 即可。

## 主题色

所有颜色集中在 `src/app.css`：

```css
@theme {
	--color-paper: #f6f3ec;
	--color-ink: #191612;
	--color-accent: #b23a1f;
}
```

暗色模式通过 `prefers-color-scheme` 覆盖同一组变量，所以不需要写两套样式，也不需要在客户端判断主题。

## 项目列表从哪来

`/projects` 页面在构建时调用 GitHub API 拉取你的公开仓库，过滤掉 fork 和归档仓库，然后按语言渲染成卡片。如果你在 Vercel 里配置了 `GITHUB_TOKEN` 环境变量，就会用它来提升速率上限；不配置也能工作，只是匿名限额低一些。

## 部署

```bash
npm install
npm run build
```

然后把仓库推到 GitHub，在 Vercel 里导入即可。域名建议用 `CNAME` 指向 `cname.vercel-dns.com`，证书由 Vercel 自动签发。

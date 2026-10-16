# Personal Site

一个静态个人主页 + 博客。SvelteKit 2 预渲染，Tailwind CSS v4 主题变量，mdsvex 写 Markdown，Vercel 托管。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物在 .vercel/output
npm run preview  # 本地预览构建产物
npm run check    # 类型与模板检查
```

## 需要改的地方

所有个人信息集中在 `src/lib/site.ts`，改这一个文件就能把站点变成你自己的：

| 字段 | 作用 |
| --- | --- |
| `name` | 站点名与页眉标题 |
| `handle` | GitHub 用户名，驱动项目页与仓库统计 |
| `url` | 站点地址，用于 canonical、RSS 和 sitemap |
| `description` | 首页副标题与默认 meta description |
| `location` / `email` | 首屏与关于页展示的联系方式 |
| `links` | 首屏的行动按钮 |
| `now` | 首页 "Now" 列表 |
| `featured` | 首页精选项目 |

同时记得更新 `static/robots.txt` 里的 sitemap 地址。

## 写文章

在 `src/content/posts/` 新建 `.md`：

```markdown
---
title: 文章标题
date: 2026-10-15
summary: 一句话摘要，会出现在列表页和 RSS 里。
tags: [svelte, notes]
---

正文。
```

文件名即 URL（`hello.md` → `/blog/hello`）。列表页、RSS、sitemap 自动收录，无需注册。加 `draft: true` 可临时隐藏。

## 页面结构

```
src/
  app.css                    主题变量与排版规则
  lib/site.ts                站点信息（改这里）
  lib/github.ts              GitHub API 拉取与语言配色
  lib/blog/index.ts          Markdown 收集、排序、日期格式化
  lib/components/RepoCard    仓库卡片
  lib/blog/PostLayout.svelte 文章排版容器
  content/posts/             文章
  routes/
    +page.svelte             首页
    blog/                    文章列表与详情
    projects/                项目页
    about/                   关于页
    rss.xml/ sitemap.xml/    构建期生成
```

## 主题

颜色、字体、圆角都在 `src/app.css` 的 `@theme` 块。暗色模式通过 `prefers-color-scheme` 覆盖同一组变量，因此不需要客户端主题脚本，也不会闪烁。

## 部署到 Vercel

1. 推到 GitHub。
2. Vercel 导入该仓库，框架会自动识别为 SvelteKit。
3. 可选：在项目环境变量里加 `GITHUB_TOKEN`，提升构建期 GitHub API 限额（未配置也能构建，只是匿名限额较低）。
4. 绑定域名时，在 DNS 处加 `CNAME` 指向 `cname.vercel-dns.com`，证书由 Vercel 自动签发。

## 说明

站点为纯静态输出：`prerender = true`，没有运行时服务器，也没有数据库。GitHub 仓库列表在构建时抓取，所以每次 push 触发的构建都会刷新它。

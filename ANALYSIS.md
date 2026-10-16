# 目标站点技术分析报告
Me.abnt.it（外部参考站点）反向分析

分析日期：2026-10-15
分析工具：REA 6.5.0（`rea analyze-javascript-application`，静态 AST 投影）

## 一、结论摘要

目标站点是一个**纯静态预渲染**的个人主页 + 博客，部署在 **Vercel**，DNS 经 **Cloudflare**。

不存在数据库、不存在运行时服务端逻辑（除构建期数据抓取）。

## 二、证据

### 2.1 部署层证据（HTTP 响应头，实测）

| 响应头 | 值 | 说明 |
| --- | --- | --- |
| Server | Vercel | 托管平台 |
| X-Vercel-Cache | HIT | 命中边缘缓存 |
| X-Vercel-Id | hnd1::... | 东京节点 |
| Cache-Control | public, must-revalidate, max-age=0 | 静态资源策略 |
| Access-Control-Allow-Origin | * | 宽松 CORS |

### 2.2 REA 静态分析证据

命令：
```
rea analyze-javascript-application <site-dir> --json
```

REA 产出：

| 指标 | 数值 |
| --- | --- |
| 清点文件数 | 13 |
| 成功解析 JS 文件 | 12 |
| 访问 AST 节点 | 36,823 |
| 分析发现（findings） | 296 |
| 解析失败 | 0 |
| 应用图节点 / 边 | 124 / 323 |

### 2.3 框架指纹（构建产物路径）

| 指纹 | 含义 |
| --- | --- |
| `_app/immutable/entry/start.*.js` | SvelteKit 客户端入口 |
| `_app/immutable/chunks/*.js` | SvelteKit 代码分割块 |
| `_app/immutable/nodes/[0-9].*.js` | SvelteKit 路由节点 |
| `data-sveltekit-preload-data="hover"` | SvelteKit 预加载指令 |
| `__sveltekit_<random>` 全局 | SvelteKit hydration 引导 |
| `class="dark"`（html 元素） | Tailwind 暗色变体约定 |

### 2.4 依赖与构建配置（由原站公开源码交叉验证）

- SvelteKit 2 + Svelte 5（runes 模式）
- Tailwind CSS v4（`@theme` 内联主题变量）
- mdsvex + shiki（Markdown 在构建期编译为 Svelte 组件并高亮）
- adapter-vercel（输出 Vercel 构建产物）
- 全站 `prerender = true`

## 三、站点结构（路由与数据流）

```
/                首页，构建期抓取 GitHub API 展示仓库
/projects        项目页，构建期抓取，客户端筛选
/blog            文章列表，客户端标签过滤
/blog/[slug]     文章详情，构建期按 slug 预渲染
/about           关于页
/rss.xml         RSS 2.0，构建期生成
/sitemap.xml     Sitemap，构建期生成
```

关键设计决定：

1. **无数据库**：文章是仓库里的 Markdown，Git 即存储。
2. **无运行时服务端**：所有页面 `prerender = true`，构建后为纯 HTML。
3. **构建期抓取**：GitHub API 在 build 时调用一次，因此每次 push 都会刷新项目列表。
4. **内容编辑走 Git**：通过 Decap CMS 提交 Markdown，而非数据库写入。

## 四、本次复刻的差异

复刻站点位于 `outputs/personal-site`，与参考站点**同构但不同观感**：

| 维度 | 参考站点 | 本次复刻 |
| --- | --- | --- |
| 主题基调 | 冷色暗黑 + 青色强调 | 暖色纸张 + 朱红强调 |
| 默认主题 | 暗色（`html class="dark"`） | 亮色，跟随系统偏好 |
| 标题字体 | 无衬线（系统栈） | 衬线（Instrument Serif + 思源宋体） |
| 首页结构 | 卡片网格 + Now + Featured | 杂志式英雄区 + 数字排版 + 编辑列表 |
| 背景 | 纯色 | 带径向遮罩的制图网格 |
| 动效 | 无明显入场动画 | 分层淡入上浮，受 reduced-motion 保护 |

保留的核心架构：SvelteKit 预渲染、Tailwind v4 变量主题、mdsvex 文章管线、构建期 GitHub 抓取、RSS/Sitemap 自动生成、Vercel 部署。

## 五、注意事项与限制

1. **静态分析的性质**：REA 以惰性文本解析 JS 与 HTML，未执行任何 bundle 引导代码。分析得出的关系是静态语法观察，不等价于运行时行为。
2. **原站内部实现未知**：无法从构建产物推断原站的完整源码组织（模块边界、私有工具函数等）。本次复刻基于其**公开源码仓库**交叉验证，而非仅凭构建产物猜测。
3. **未分析的内容**：`index.html` 中含 1 段内联脚本未被 REA 分析，其中可能存在的引用未纳入证据。
4. **合规**：分析对象为公开可访问的静态资源，且原站作者已公开发布源码与实现说明。

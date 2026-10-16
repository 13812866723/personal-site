# 让别人访问这个站点

分三个层次：同一 WiFi、公网免费托管、自己的域名。按需要选。

---

## 0. 部署前必做

`src/lib/site.ts` 和 `static/robots.txt` 里还是占位值。这两个必须先改，否则
canonical、RSS、sitemap 会指向 `example.com`，搜索引擎收录会出错。

改完跑一次：

```bash
npm run check
npm run build
```

`npm run build` 通过就没有别的前置条件了。

---

## 1. 只在同一 WiFi 下访问（局域网）

适合给同事、家人演示，不需要任何账号。

```bash
npm run build
npx vite preview --port 4174 --host 0.0.0.0
```

`--host 0.0.0.0` 是关键：默认只听 `localhost`，外部设备连不上。

然后查本机内网 IP：

```powershell
(Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' }
).IPAddress
```

别人在浏览器打开 `http://<你的IP>:4174/`。

两个常见问题：

- **Windows 防火墙弹窗**：选"允许访问"，并且网络类型要勾上"专用网络"。如果
  当时点了取消，去 `控制面板 → Windows Defender 防火墙 → 允许应用通过防火墙`
  里把 Node.js 的入站规则打开。
- **换了网络 IP 就变**：路由器 DHCP 分配的地址不固定，重连 WiFi 后要重新查。

这个方案仅限同一局域网，外网访问不了。

---

## 2. 公网免费托管

让任何人随时随地都能打开。三个平台都免费、都自动签 HTTPS。

### 2.1 Vercel（最贴合本项目）

项目现在用的就是 `@sveltejs/adapter-vercel`，零改动。

1. 把代码推到 GitHub（见下面第 3 节）。
2. 打开 [vercel.com/new](https://vercel.com/new)，用 GitHub 账号登录。
3. 选中这个仓库，Import。框架会自动识别成 SvelteKit，构建命令和输出目录
   都不用填。
4. Deploy，几十秒后拿到 `https://<项目名>.vercel.app`。

以后每次 `git push`，Vercel 自动重新构建部署。

可选：在 Vercel 项目的 Settings → Environment Variables 里加一个
`GITHUB_TOKEN`（GitHub 的 Personal Access Token）。首页的项目列表是构建时
调 GitHub API 抓的，匿名请求每小时只有 60 次，加了 token 提到 5000 次。
不加也能构建成功。

### 2.2 Cloudflare Pages

1. 推到 GitHub。
2. [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages →
   Create → Pages → Connect to Git。
3. 构建命令 `npm run build`，输出目录 `.vercel/output/static`。
4. 保存部署，得到 `https://<项目名>.pages.dev`。

Cloudflare 的 CDN 节点多，海外访问速度通常比 Vercel 好。

### 2.3 GitHub Pages

完全免费，而且不需要额外注册任何账号——有 GitHub 账号就够。

需要把适配器换成静态输出：

```bash
npm install -D @sveltejs/adapter-static
```

然后改 `vite.config.ts`：

```ts
import adapter from '@sveltejs/adapter-static';

// 在 sveltekit({...}) 里替换掉那一行
adapter: adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false
}),
```

仓库名如果不是 `<用户名>.github.io`，还要加 base 路径，否则 CSS/JS 会 404：

```ts
paths: { base: '/<仓库名>' }
```

改完提交推到 `main`，然后在仓库 Settings → Pages 里把 Source 选成
`GitHub Actions`，用官方的 SvelteKit 静态站点工作流即可。

---

## 3. 把代码推到 GitHub

这台机器上 `git` 全局配了 `http.proxy=http://127.0.0.1:7890`，但那个端口现在
是关的，直连 GitHub 反而正常。所以推送前要么临时绕开代理，要么把配置删掉。

永久清掉（推荐，直连本来就通）：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

仓库已经初始化好并提交过一次。接下来：

```bash
cd D:\work\personal-site

# 在 GitHub 网页上新建一个空仓库（不要勾 README / .gitignore），然后：
git remote add origin git@github.com:<你的用户名>/<仓库名>.git
git push -u origin main
```

用 SSH 而不是 HTTPS，可以完全绕开上面那个代理问题。本机 `~/.ssh` 里的密钥
已经能通过 GitHub 认证了。

---

## 4. 绑定自己的域名

`.vercel.app` / `.pages.dev` 这种地址别人记不住，也显得不正式。

1. 买域名：Namecheap、Cloudflare Registrar、Porkbun 都在 10 美元/年左右。
2. 在托管平台的项目设置里添加域名，平台会告诉你加什么 DNS 记录。
3. Vercel 一般是 `CNAME` 指向 `cname.vercel-dns.com`。
4. DNS 生效后平台自动签发 Let's Encrypt 证书，HTTPS 免费。
5. 回 `src/lib/site.ts` 把 `url` 改成新域名，同步改 `static/robots.txt`，
   重新部署。这一步不能忘，否则 RSS 和 sitemap 里的链接还是旧的。

### 如果访客主要在中国大陆

上面三个平台在国内的连通性都不稳定，`*.vercel.app` 和 `*.pages.dev` 经常被
DNS 污染，GitHub Pages 也时快时慢。

想要国内稳定访问，只有一条路：大陆境内的服务器 + 域名，并且完成
**ICP 备案**。

1. 买域名（阿里云 / 腾讯云）。
2. 买一台大陆节点的轻量应用服务器，最低配约 60-100 元/年。
3. 提交 ICP 备案，通常 7-20 个工作日，期间网站不能对外提供访问。
4. 备案通过后，用 Nginx 托管 `build/` 目录里的静态文件，用 certbot 签 HTTPS。
   因为是纯静态站点，Nginx 配置很短，不需要 Node.js 运行时。

备案是硬性要求，没得绕。如果访客在海外，或者能接受偶尔打不开，用第 2 节的
方案就够，省钱也省事。

---

## 小结

| 场景 | 方案 | 成本 | 前置条件 |
| --- | --- | --- | --- |
| 同一 WiFi 演示 | `--host 0.0.0.0` | 0 | 无 |
| 海内外都能打开，省事 | Vercel | 0 | GitHub 账号 |
| 海外速度快 | Cloudflare Pages | 0 | GitHub 账号 |
| 不想注册新账号 | GitHub Pages | 0 | 改适配器 |
| 国内稳定访问 | 大陆服务器 | 域名 + 服务器 + 备案 | ICP 备案 |

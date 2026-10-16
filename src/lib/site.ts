/**
 * Single source of truth for identity, links and hard-coded copy.
 * Everything here is prerendered, so edit freely and rebuild.
 */
export const site = {
	name: '你的名字',
	/** GitHub username. Drives the projects page, repo count and pinned cards. */
	handle: 'your-github-username',
	url: 'https://example.com',
	title: '你的名字',
	description: '一句话介绍你自己：你在做什么、关心什么。',
	location: 'City, Country',
	email: 'you@example.com',
	github: 'https://github.com/your-github-username'
};

/** Hero call-to-action buttons. Keep this list short and high-signal. */
export const links = [
	{ label: 'GitHub', href: site.github, note: `@${site.handle}` },
	{ label: 'Email', href: `mailto:${site.email}`, note: site.email }
];

/** Optional "Now" ledger on the home page. Delete entries you do not need. */
export const now = [
	{ title: '正在做的事', detail: '替换成你当前投入最多的项目，一句话说清它在解决什么。' },
	{ title: '正在学的东西', detail: '课程、论文、语言，或者任何一个还在进行中的技能。' }
];

/**
 * Pinned projects on the home page. `repo` accepts either `owner/name` or a
 * bare GitHub URL, so a whole repository series can be pinned as one entry.
 */
export const featured = [
	{
		name: '一个值得先看的项目',
		repo: `${site.handle}/your-featured-repo`,
		tag: 'TypeScript · CLI',
		desc: '这个项目做什么，以及为什么它有意思。'
	}
];

type MapKey<T extends Map<any, any>> = T extends Map<infer K, any> ? K : never

/**
 * Metadata for your site
 */
export const SITE: Record<string, string> = {
	/**
	 * Base URL of your site, used in sitemap generation
	 */
	url: 'https://astro-theme-minimal-blog.lekoarts.de',
	/**
	 * Site-wide title
	 */
	title: 'ryu.write',
	/**
	 * Used on index page and as a fallback if no title is set
	 */
	titleDefault: 'ryu.write',
	/**
	 * Used in meta tags and other places
	 */
	description: '다양한 코드 구문 강조와 읽기 편한 글꼴, 깔끔한 디자인으로 콘텐츠에 집중할 수 있는 Astro 블로그 테마입니다.',
	/**
	 * Language used in the <html> tag
	 */
	lang: 'ko-KR',
	/**
	 * Name of the image inside `public` folder that should be used as a default og:image
	 */
	defaultOgImage: '/og-image.png',
	/**
	 * Default author name that gets added to meta tags
	 */
	defaultAuthor: 'LekoArts',
}

interface Header {
	internal: Array<{ title: string, url: string }>
}

/**
 * Links used in the header
 */
export const HEADER: Header = {
	/**
	 * Internal links to other subpages shown in the header navigation
	 */
	internal: [
		{
			title: 'note',
			url: '/note/',
		},
		{
			title: 'blog',
			url: '/blog/',
		},
	],
}

/**
 * A map of name - slug pairs
 */
export const FRONTMATTER_TAGS = new Map(
	[
		['일반', 'general'] as const,
		['개발', 'coding'] as const,
		['MDX', 'mdx'] as const,
		['오픈 소스', 'open-source'] as const,
		['서울', '서울'] as const,
	],
)

export type FrontmatterTag = MapKey<typeof FRONTMATTER_TAGS>

export const SKIP_NAV_ID = 'skip-to-content'

/**
 * Available "asides" that can be used in MDX files
 */
export const ASIDE_TYPES = ['note', 'tip', 'caution', 'danger'] as const
export type AsideType = (typeof ASIDE_TYPES)[number]

# ryu.write

Welcome to **ryu.write**, a space for thoughts and things learned. It's easy to set up and features everything you'd need for a blog.

[**Demo Website**](https://astro-theme-minimal-blog.lekoarts.de)

## ✨ Features

- Write blog posts with MDX
- Styled with [Tailwind](https://tailwindcss.com/)
- Code blocks powered by [Expressive Code](https://expressive-code.com/)
- Custom asides component
- Live coding powered by [Sandpack](https://github.com/codesandbox/sandpack)
- Sitemap
- Light/Dark toggle (initially follows the system preference)
- Add tags to your blog posts
- [Pagefind](https://pagefind.app/) search

## 🚀 Getting started

1. **Important:** Ensure that [pnpm](https://pnpm.io/installation) is installed
1. Clone the [astro-theme-minimal-blog](https://github.com/LekoArts/astro-theme-minimal-blog) repository.
1. Install dependencies.
   ```shell
   pnpm install
   ```
1. Run the development server.
   ```shell
   pnpm dev
   ```

## 📝 Using & modifying this theme

### Keystatic CMS

관리 화면: `/keystatic/`. 글은 기존 `content/blog/*/index.mdx`, `content/note/*/index.mdx`에 저장됩니다.
제목·날짜·태그는 폼으로, 본문은 MDX 원문으로 편집합니다. 기존 글의 HTML과 MDX 구문을 보존하기 위한 구성입니다.
본문 이미지에는 Markdown 이미지 문법을 사용합니다. 이미지 업로드 UI는 포함하지 않습니다.

#### 최초 GitHub 연결

1. `pnpm dev` 실행 후 `http://127.0.0.1:4321/keystatic/`에 접속합니다. `.env.example`의 빈 값을 복사할 필요는 없습니다.
2. GitHub 로그인/설정 화면에서 배포 주소에 `https://blog-personal-8948.vercel.app`을 입력하고 GitHub App을 생성합니다.
3. App을 설치할 때 `rbase0218/blog` 저장소에 접근을 허용합니다. 생성된 인증 값은 로컬 `.env`에 저장됩니다.
4. Vercel 프로젝트의 Environment Variables에 아래 네 값을 `.env`에서 복사하고 재배포합니다. 비밀 값은 Git이나 채팅에 올리지 마세요.

| 변수 | 유형 | Vercel 환경 |
| --- | --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Config (Secret도 가능) | Production, Preview |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Secret | Production, Preview |
| `KEYSTATIC_SECRET` | Secret | Production, Preview |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Config | Production, Preview |

Name에는 `=` 왼쪽 이름을, Value에는 `=` 오른쪽 값을 넣습니다. 뒤에 붙은 `#` 주석은 제외합니다.
App Slug는 공개용 이름이므로 `PUBLIC_` 접두사를 유지하고 Config 유형으로 등록합니다.

Vercel Framework Preset은 Astro, Build Command는 `pnpm build`를 사용하고 Output Directory는 기본값으로 둡니다.
Keystatic API는 Vercel Functions에서 실행되며, 검색 인덱스는 `.vercel/output/static/pagefind`에 생성됩니다.

#### 글 작성 → 미리보기 → 공개

1. 운영 주소의 `/keystatic/`에서 로그인합니다.
2. 브랜치 메뉴에서 새 작업 브랜치를 만듭니다. 새 브랜치에는 `content/` 접두사가 붙습니다. **`main`에서 저장하면 바로 운영 배포되므로 저장 전에 브랜치를 확인하세요.**
3. 블로그 또는 노트에서 글을 작성하고 저장합니다. 글 주소는 두 종류의 글 전체에서 중복되지 않게 입력합니다. 기존 글의 저장 폴더 이름은 유지해야 상대경로 이미지가 계속 연결됩니다.
4. 해당 브랜치의 GitHub Pull Request를 열고 Vercel의 Preview 링크에서 실제 화면을 확인합니다. 저장 후 빌드가 끝나야 최신 내용이 보이며, 입력 즉시 반영되는 Preview는 아닙니다. 편집은 운영 주소의 CMS에서 계속합니다.
5. 확인한 Pull Request를 `main`에 병합하면 공개됩니다. 운영 사이트에 공개되기 전에도 초안은 저장소와 Preview 배포의 접근 권한에 따라 보일 수 있습니다.

도메인을 변경하면 GitHub App의 Callback URL에 `https://새도메인/api/keystatic/github/oauth/callback`을 추가하고, Homepage URL과 `src/constants.ts`의 `SITE.url`을 변경합니다. 저장소 연결을 다시 만들 필요는 없습니다.

#### 로컬 편집 및 검증

GitHub 없이 화면을 확인하려면 `.env`에 `PUBLIC_KEYSTATIC_LOCAL=true`를 설정하고 개발 서버를 재시작합니다.
이 옵션은 개발 서버에만 적용되며, 배포 빌드는 항상 GitHub 모드입니다. GitHub App 설정 전에 옵션을 지우거나 `false`로 바꾸세요.

```sh
pnpm test:cms
pnpm build
```

Windows에서 Vercel 빌드 중 `EPERM ... symlink`가 발생하면 pnpm의 링크를 복사할 권한이 없는 경우입니다.
Windows 개발자 모드에서 심볼릭 링크 생성을 허용하거나, 별도 체크아웃에서 `pnpm install --node-linker=hoisted` 후 빌드할 수 있습니다. Vercel의 Linux 빌드는 이 Windows 권한 제한을 받지 않습니다.

연동 기준: [Keystatic GitHub 모드](https://keystatic.com/docs/github-mode), [Astro 연동](https://keystatic.com/docs/installation-astro).

### Add content

This theme features a CLI to help you scaffold new blog posts. It asks you questions to fill out the frontmatter and creates a file in the end. Run the CLI:

```shell
pnpm assistant
```

If you want to extend it, change the [`assistant.ts`](./scripts/assistant.ts) file.

### Change constants

Parts of the theme are referencing [`constants.ts`](./src/constants.ts) to e.g. set the site title or main navigation. Modify its contents to suit your site before deploying it.

### Change existing tags / Add new tags

Inside [`constants.ts`](./src/constants.ts) the `FRONTMATTER_TAGS` map contains the available tags for your site. You need to add your display name and slug of the tag inside this map. The display name will be used in the UI and the slug will be used in the URL.

It's referenced by Astro's content collections and also by the [`assistant.ts`](./scripts/assistant.ts) file.

You can add a new tag like so:

```ts
export const FRONTMATTER_TAGS = new Map(
	[
		// Existing tags...
		['Display name', 'slug-of-your-tag'] as const,
	],
)
```

## 🔍 Reference

### Blog post frontmatter

By default, these frontmatter fields are available. You need to change [`content.config.ts`](./src/content.config.ts) to adjust it.

```yaml
title: Markdown Reference Overview
slug: markdown-reference-overview
description: A post showcasing the markdown formatting of a post
date: 2025-02-18
lastUpdated: 2025-02-18
tags:
  - 일반
  - MDX
searchIndex: true
image: https://absolute-link.google.com/image.png
```

### Custom MDX components

#### `<Aside>`

```md
:::note
Text
:::

:::caution[Watch out!]
Text
:::

:::tip
Text
:::

:::danger
Text
:::
```

#### `<Playground>`

````md
<Playground template="react">

```js name=App.js active
export default function App() {
  return <h1>Hello World</h1>
}
```

</Playground>
````

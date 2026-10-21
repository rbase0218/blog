import { collection, config, fields } from '@keystatic/core'
import { FRONTMATTER_TAGS } from './src/constants'
import { mdxSource } from './src/keystatic/mdx-source'

const schema = {
	title: fields.slug({
		name: { label: '제목', validation: { isRequired: true } },
		slug: {
			label: '저장 폴더 이름',
			description: '기존 글의 폴더 이름은 유지하세요. 글 주소는 아래 항목에서 정합니다.',
		},
	}),
	slug: fields.text({
		label: '글 주소',
		description: '예: my-first-post. blog와 note 전체에서 중복되지 않는 주소를 사용하세요.',
		validation: {
			isRequired: true,
			pattern: {
				regex: /^(?!(?:blog|note|tags|keystatic|api|pagefind|index|404)$)[a-z0-9]+(?:-[a-z0-9]+)*$/,
				message: '영문 소문자·숫자·하이픈을 사용하세요. 사이트 메뉴 주소는 사용할 수 없습니다.',
			},
		},
	}),
	description: fields.text({ label: '글 소개', multiline: true, validation: { isRequired: true } }),
	date: fields.date({ label: '작성일', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
	lastUpdated: fields.date({ label: '수정일', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
	tags: fields.multiselect({
		label: '태그',
		options: Array.from(FRONTMATTER_TAGS.keys(), value => ({ label: value, value })),
	}),
	image: fields.text({ label: '대표 이미지 주소', description: '선택 사항. 이미지의 전체 URL을 입력하세요.' }),
	searchIndex: fields.checkbox({ label: '사이트 검색에 포함', defaultValue: true }),
	content: mdxSource,
}

export default config({
	storage: import.meta.env?.DEV && import.meta.env.PUBLIC_KEYSTATIC_LOCAL === 'true'
		? { kind: 'local' }
		: { kind: 'github', repo: 'rbase0218/blog', branchPrefix: 'content/' },
	locale: 'ko-KR',
	ui: { brand: { name: 'ryu.write' } },
	collections: {
		blog: collection({
			label: '블로그',
			path: 'content/blog/*/',
			slugField: 'title',
			format: { contentField: 'content' },
			columns: ['title', 'date'],
			schema,
		}),
		note: collection({
			label: '노트',
			path: 'content/note/*/',
			slugField: 'title',
			format: { contentField: 'content' },
			columns: ['title', 'date'],
			schema,
		}),
	},
})

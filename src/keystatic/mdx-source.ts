import type { ContentFormField } from '@keystatic/core'
import { fields } from '@keystatic/core'

const input = fields.text({
	label: '본문 (MDX)',
	multiline: true,
	description: 'Markdown과 HTML을 작성하세요. 저장 후 Vercel Preview에서 실제 화면을 확인할 수 있습니다.',
})

// shortcut: source editing preserves arbitrary MDX; use a rich editor only after all existing syntax can round-trip.
export const mdxSource: ContentFormField<string, string, string> = {
	kind: 'form',
	formKind: 'content',
	contentExtension: '.mdx',
	Input: input.Input,
	defaultValue: input.defaultValue,
	validate: value => input.validate(value, undefined),
	parse: (_value, { content }) => new TextDecoder('utf-8', { fatal: true }).decode(content),
	serialize: value => ({
		value: undefined,
		content: new TextEncoder().encode(value),
		other: new Map(),
		external: new Map(),
	}),
	reader: {
		parse: (_value, { content }) => new TextDecoder('utf-8', { fatal: true }).decode(content),
	},
}

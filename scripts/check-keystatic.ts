import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { it } from 'node:test'
import { createReader } from '@keystatic/core/reader'
import config from '../keystatic.config'
import { mdxSource } from '../src/keystatic/mdx-source'

it('existing MDX bodies survive editing without losing HTML, code or image links', async () => {
	for (const name of ['blog', 'note']) {
		const files = await readdir(`content/${name}`, { recursive: true })
		for (const file of files.filter(file => file.endsWith('.mdx'))) {
			const source = await readFile(`content/${name}/${file}`, 'utf8')
			const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
			const content = new TextEncoder().encode(body)
			const parsed = mdxSource.parse(undefined, { content, other: new Map(), external: new Map(), slug: undefined })
			assert.deepEqual(mdxSource.serialize(parsed, { slug: undefined }).content, content)
			assert.equal(mdxSource.reader.parse(undefined, { content }), body)
		}
	}
})

it('empty drafts work and invalid UTF-8 is rejected instead of silently corrupted', () => {
	assert.equal(mdxSource.reader.parse(undefined, { content: undefined }), '')
	assert.throws(() => mdxSource.reader.parse(undefined, { content: new Uint8Array([0xFF]) }))
})

it('keystatic reads existing frontmatter and posts from both collections', async () => {
	const reader = createReader(process.cwd(), config)
	for (const name of ['blog', 'note'] as const) {
		const collection = reader.collections[name]
		const posts = await collection.all()
		assert.ok(posts.length > 0)
		for (const { slug, entry } of posts) {
			assert.ok(entry.title)
			assert.match(entry.date, /^\d{4}-\d{2}-\d{2}$/)
			const source = await readFile(`content/${name}/${slug}/index.mdx`, 'utf8')
			assert.ok(source.endsWith(await entry.content()))
		}
	}
})

it('post addresses reject reserved routes and invalid path characters', () => {
	const field = config.collections.blog.schema.slug
	assert.equal(field.validate('my-first-post', undefined), 'my-first-post')
	for (const value of ['', '../escape', 'two/segments', 'has space', 'blog', 'keystatic']) {
		assert.throws(() => field.validate(value, undefined))
	}
})

it('direct Node usage defaults to GitHub, never local filesystem storage', () => {
	assert.equal(config.storage.kind, 'github')
})

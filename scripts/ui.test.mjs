import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Use the built-in runner without adding a dependency.
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

function script(name) {
	return readFileSync(new URL(`../src/components/${name}.astro`, import.meta.url), 'utf8').match(/<script(?: is:inline)?>([\s\S]*?)<\/script>/)[1]
}

test('reading progress follows scrolling, viewport and content height changes, and clamps overscroll', () => {
	const listeners = new Map()
	const bar = { style: {} }
	const root = { scrollHeight: 2000 }
	const body = {}
	let contentResized
	const window = {
		innerHeight: 1000,
		scrollY: 0,
		addEventListener: (name, callback) => listeners.set(name, callback),
	}
	vm.runInNewContext(ts.transpile(script('reading-progress'), { target: ts.ScriptTarget.ES2022 }), {
		window,
		document: { documentElement: root, body, querySelector: () => bar },
		ResizeObserver: class {
			constructor(callback) { contentResized = callback }
			observe(target) { assert.equal(target, body) }
		},
	})
	assert.equal(bar.style.transform, 'scaleX(0)')
	window.scrollY = 500
	listeners.get('scroll')()
	assert.equal(bar.style.transform, 'scaleX(0.5)')
	window.innerHeight = 1500
	listeners.get('resize')()
	assert.equal(bar.style.transform, 'scaleX(1)')
	root.scrollHeight = 3500
	contentResized()
	assert.equal(bar.style.transform, 'scaleX(0.25)')
	for (const [offset, expected] of [[-100, 0], [5000, 1]]) {
		window.scrollY = offset
		listeners.get('scroll')()
		assert.equal(bar.style.transform, `scaleX(${expected})`)
	}
	root.scrollHeight = window.innerHeight
	window.scrollY = 0
	contentResized()
	assert.equal(bar.style.transform, 'scaleX(1)')
})

test('theme follows the system until toggled, persists choices, and tolerates blocked storage', () => {
	for (const stored of [null, 'auto', 'invalid', 'light', 'dark']) {
		for (const blocked of [false, true]) {
			const button = {
				setAttribute: (key, value) => {
					button[key] = value
				},
			}
			const root = { dataset: {} }
			let onChange
			let saved
			const media = {
				matches: true,
				addEventListener: (_, callback) => {
					onChange = callback
				},
			}
			const window = { matchMedia: () => media }
			vm.runInNewContext(script('theme-provider'), {
				window,
				document: { documentElement: root, querySelectorAll: () => [button] },
				localStorage: {
					getItem() {
						if (blocked)
							throw new Error('Storage blocked')
						return stored
					},
					setItem(key, value) {
						if (blocked)
							throw new Error('Storage blocked')
						assert.equal(key, 'atmb-theme')
						saved = value
					},
				},
			})
			assert.equal(root.dataset.theme, !blocked && stored === 'light' ? 'light' : 'dark')
			media.matches = false
			onChange()
			const before = !blocked && stored === 'dark' ? 'dark' : 'light'
			assert.equal(root.dataset.theme, before)
			window.AtmbThemeProvider.toggle()
			const after = before === 'dark' ? 'light' : 'dark'
			assert.equal(root.dataset.theme, after)
			assert.equal(button['aria-pressed'], String(after === 'dark'))
			if (!blocked)
				assert.equal(saved, after)
			media.matches = true
			onChange()
			assert.equal(root.dataset.theme, after)
			window.AtmbThemeProvider.toggle()
			assert.equal(root.dataset.theme, before)
		}
	}
})

test('inline search submits to Pagefind and keeps modal focus, closing, and keyboard shortcuts', async () => {
	const listeners = new Map()
	const query = { value: '  마크다운  ' }
	const submit = { disabled: true }
	const form = {
		querySelector: selector => selector === 'input' ? query : submit,
		addEventListener: (_, callback) => listeners.set('submit', callback),
	}
	let focused = false
	const dialog = {
		open: false,
		showModal() { this.open = true },
		close() {
			this.open = false
			listeners.get('close')()
		},
		querySelector: () => ({ focus: () => { focused = true } }),
		addEventListener: (name, callback) => listeners.set(name, callback),
	}
	const close = { addEventListener: (_, callback) => listeners.set('close-button', callback) }
	const targets = { form, dialog, 'button[data-close-modal]': close, '#dialog-frame': { contains: () => false } }
	let Search
	let ready
	let searched
	let modalOpen = false
	const source = script('search')
		.replace('import(\'@pagefind/default-ui\')', 'Promise.resolve({ PagefindUI: MockPagefindUI })')
		.replaceAll('import.meta.env.BASE_URL', '\'/\'')
	vm.runInNewContext(ts.transpile(source, { target: ts.ScriptTarget.ES2022 }), {
		HTMLElement: class {
			dataset = {}
			querySelector(selector) { return targets[selector] }
		},
		customElements: { get: () => false, define: (_, constructor) => { Search = constructor } },
		document: { body: { contains: () => true, toggleAttribute: (_, value) => { modalOpen = value } } },
		window: {
			addEventListener: (name, callback) => listeners.set(name, callback),
			removeEventListener: name => listeners.delete(name),
			requestIdleCallback: (callback) => { ready = callback() },
		},
		MockPagefindUI: class {
			triggerSearch(term) {
				searched = term
			}
		},
	})
	const component = new Search()
	assert.ok(component)
	let prevented = false
	const event = {
		preventDefault: () => {
			prevented = true
		},
	}
	listeners.get('submit')(event)
	assert.ok(prevented)
	assert.equal(dialog.open, false)
	listeners.get('DOMContentLoaded')()
	await ready
	assert.equal(submit.disabled, false)
	listeners.get('submit')(event)
	assert.equal(searched, '마크다운')
	assert.ok(dialog.open && modalOpen && focused)
	listeners.get('close-button')()
	assert.ok(!dialog.open && !modalOpen)
	listeners.get('keydown')({ ...event, ctrlKey: true, key: 'k' })
	assert.ok(dialog.open)
	listeners.get('keydown')({ ...event, metaKey: true, key: 'k' })
	assert.equal(dialog.open, false)
})

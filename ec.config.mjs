import { pluginCollapsibleSections, pluginCollapsibleSectionsTexts } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { defineEcConfig, pluginFramesTexts } from 'astro-expressive-code'

pluginFramesTexts.addLocale('ko-KR', {
	terminalWindowFallbackTitle: '터미널 창',
	copyButtonTooltip: '클립보드에 복사',
	copyButtonCopied: '복사 완료!',
})

pluginCollapsibleSectionsTexts.addLocale('ko-KR', {
	collapsedLines: '{lineCount}줄 접힘',
})

export default defineEcConfig({
	defaultLocale: 'ko-KR',
	themes: ['github-light', 'github-dark'],
	plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
	defaultProps: {
		showLineNumbers: false,
		collapseStyle: 'collapsible-auto',
	},
	styleOverrides: {
		codeFontFamily: 'Pretendard',
		uiFontFamily: 'Pretendard',
		frames: {
			shadowColor: 'none',
		},
	},
	themeCssSelector: (theme, { styleVariants }) => {
		/**
		 * This Astro starter uses data-theme="light" and data-theme="dark" on its <html> element. It gets changed by a script and the theme switcher.
		 * Expressive Code should follow this if a light and dark theme are available.
		 * If only one theme is available, it will return the default selector.
		 */
		if (styleVariants.length === 2) {
			// Light theme
			const baseTheme = styleVariants[0]?.theme
			// Dark theme
			const altTheme = styleVariants.find(v => v.theme.type !== baseTheme?.type)?.theme
			if (theme === baseTheme || theme === altTheme)
				return `[data-theme='${theme.type}']`
		}

		// Return the default selector
		return `[data-theme='${theme.name}']`
	},
})

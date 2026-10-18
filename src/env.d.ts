declare namespace astroHTML.JSX {
	interface HTMLAttributes {
		value?: string
	}
}

declare let AtmbThemeProvider: {
	updateToggles: () => void
	toggle: () => void
}

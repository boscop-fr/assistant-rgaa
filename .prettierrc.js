/** @type {import("prettier").Config} */
export default {
	arrowParens: 'always',
	bracketSpacing: false,
	htmlWhitespaceSensitivity: 'css',
	printWidth: 80,
	proseWrap: 'always',
	quoteProps: 'preserve',
	semi: true,
	singleQuote: true,
	tabWidth: 3,
	trailingComma: 'none',
	useTabs: true,
	overrides: [
		{
			files: ['*.md', '*.yml'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		}
	]
};

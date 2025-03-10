/** @type {import("prettier").Config} */
export default {
	arrowParens: 'always',
	bracketSpacing: false,
	htmlWhitespaceSensitivity: 'ignore',
	jsxSingleQuote: false,
	plugins: ['@trivago/prettier-plugin-sort-imports'],
	printWidth: 80,
	proseWrap: 'always',
	quoteProps: 'preserve',
	semi: true,
	singleQuote: true,
	tabWidth: 3,
	trailingComma: 'none',
	useTabs: true,
	importOrder: ['^[./]'],
	importOrderSortSpecifiers: true,
	overrides: [
		{
			files: '*.[jt]sx?',
			options: {
				parser: 'typescript'
			}
		},
		{
			files: ['package.json', 'package-lock.json', '*.yml', '*.md'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		},
		{
			files: '*.html',
			options: {
				htmlWhitespaceSensitivity: 'css'
			}
		}
	]
};

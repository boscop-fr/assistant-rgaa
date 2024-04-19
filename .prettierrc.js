const sortImportsPlugin = require.resolve(
	'@trivago/prettier-plugin-sort-imports'
);

/** @type {import("prettier").Config} */
module.exports = {
	arrowParens: 'always',
	bracketSpacing: false,
	htmlWhitespaceSensitivity: 'ignore',
	jsxSingleQuote: false,
	plugins: [sortImportsPlugin],
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
		}
	]
};

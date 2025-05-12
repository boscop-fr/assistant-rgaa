import fs from 'node:fs';
import path from 'node:path';

export type SelectorCatalog = Record<string, string[]>;
export type CompiledSelectorCatalog = Record<string, string>;

const compileSelectorCatalog = (
	catalog: SelectorCatalog
): CompiledSelectorCatalog =>
	Object.fromEntries(
		Object.entries(catalog).map(([name, selectors]) => [
			name,
			`:is(${selectors.join(',')})`
		])
	);

export default function (content) {
	const catalogPath = `${this.context}/catalogs/${path.basename(this.resourcePath)}`;

	if (!fs.existsSync(catalogPath)) {
		return content;
	}

	const rawCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
	const catalog = compileSelectorCatalog(rawCatalog);
	const keys = Object.keys(catalog);
	const keysMatcher = `(${keys.join('|')})`;
	const pseudoMatcher = new RegExp(`:rgaa\\(${keysMatcher}\\)`, 'gi');

	// @todo Safer replacement to avoid JSON formatting issues
	return content.replaceAll(pseudoMatcher, (_, key) => catalog[key]);
}

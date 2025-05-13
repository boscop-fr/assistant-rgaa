import fs from 'node:fs';
import path from 'node:path';
import type {LoaderContext} from '@rspack/core';

type SelectorCatalog = Record<string, string[]>;
type HelpersLoaderOptions = {
	catalogsPath: string;
	pseudoClass: string;
};

const escapeJsonString = (string: string) =>
	JSON.stringify(string).substring(1, string.length - 1);

export default function helpersLoader(
	this: LoaderContext<HelpersLoaderOptions>,
	content: string
) {
	const {catalogsPath = `${this.context}/catalogs`, pseudoClass = ':rgaa'} =
		this.getOptions();

	if (!content.includes(pseudoClass)) {
		return content;
	}

	const catalogPath = `${catalogsPath}/${path.basename(this.resourcePath)}`;

	if (!fs.existsSync(catalogPath)) {
		throw new Error(`No selector catalog found at \`${catalogPath}\``);
	}

	const rawCatalog = JSON.parse(
		fs.readFileSync(catalogPath, 'utf-8')
	) as SelectorCatalog;

	const catalog = Object.fromEntries(
		Object.entries(rawCatalog).map(([name, selectors]) => [
			name,
			`:is(${selectors.join(',')})`
		])
	);

	const pattern = `${pseudoClass}\\(([^)]+)\\)`;
	const rx = new RegExp(pattern, 'gi');

	return content.replaceAll(rx, (selector, key) => {
		if (!(key in catalog)) {
			const relativePath = path.relative(this.rootContext, this.resourcePath);
			const relativeCatalogPath = path.relative(this.rootContext, catalogPath);

			throw new Error(
				`No \`${key}\` selector found in \`${relativeCatalogPath}\`` +
					`(as required by \`${selector}\` in ${relativePath})`
			);
		}

		return escapeJsonString(catalog[key]);
	});
}

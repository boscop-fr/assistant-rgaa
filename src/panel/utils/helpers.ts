import type {CompiledSelectorCatalog, HelpersByTest, SelectorCatalog} from '../../common/types';

const compileSelectorCatalog = (catalog: SelectorCatalog) : CompiledSelectorCatalog=>
	Object.fromEntries(
		Object.entries(catalog).map(([name, selectors]) => [
			name,
			`:is(${selectors.join(',')})`
		])
	)

const expandSelectorCatalog = (selector: string, catalog: CompiledSelectorCatalog) => {
	
};

const fetchCatalog = (version: string) =>
	import(
		/* webpackChunkName: "helpers-" */
		`../../../data/helpers/catalogs/${version}.json`
	).then((module) => module.default as SelectorCatalog);

const fetchRawHelpers = (version: string) =>
	import(
		/* webpackChunkName: "helpers-" */
		`../../../data/helpers/${version}.json`
	).then((module) => module.default as HelpersByTest);

/*
 * retrieve the helpers mapping full json object from a given reference version
 */
export const fetchHelpers = async (version: string) => {
	const [rawHelpers, catalog] = await Promise.all([
		fetchRawHelpers(version),
		fetchCatalog(version)
	]);

	for (const test in rawHelpers) {
		const helpers = rawHelpers[test as keyof typeof rawHelpers];

		for (let i = 0; i < helpers.length; i++) {
			helpers[i];
		}
	}
};

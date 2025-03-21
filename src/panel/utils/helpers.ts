import type {HelpersByTest} from '../../common/types';

/*
 * retrieve the helpers mapping full json object from a given reference version
 */
export const fetchHelpers = (version: string) =>
	import(
		/* webpackChunkName: "helpers-" */
		`../../../data/helpers/${version}.json`
	).then((module) => module.default as HelpersByTest);

import {type HelpersByTest} from '../../common/types';

/*
 * retrieve the helpers mapping full json object from a given reference version
 */
export const fetchHelpers = async (version: string) => {
	const response = await fetch(
		browser.runtime.getURL(`data/helpers/${version}.json`)
	);
	return (await response.json()) as HelpersByTest;
};

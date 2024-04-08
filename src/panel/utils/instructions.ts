import {Instructions} from '../../common/types';

// Retrieves instructions mapping for the given version.
export const fetchInstructions = async (version: string) => {
	const response = await fetch(
		browser.runtime.getURL(`data/instructions/${version}.json`)
	);
	return (await response.json()) as Instructions[];
};

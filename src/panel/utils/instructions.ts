import type {Instructions} from '../../common/types';

// Retrieves instructions mapping for the given version.
export const fetchInstructions = (version: string) =>
	import(
		/* webpackChunkName: "instructions-" */
		`../../../data/instructions/${version}.json`
	).then((module) => module.default as Instructions);

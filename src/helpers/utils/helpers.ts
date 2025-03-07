import {toggleClassEffect} from '../effects/dom';
import {highlightElementsEffect} from '../effects/highlight';
import {type Helper, helperInfo} from '../types';
import {combineEffects} from './effects';

let revertEffects: () => void;

export const applyHelpers = (helpers: Helper[]) => {
	const helperEffects = helpers.flatMap((helper) => {
		try {
			const {module, args} = helperInfo(helper);
			return module.apply(args);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
	});

	const apply = combineEffects([
		...helperEffects,
		highlightElementsEffect(),
		toggleClassEffect(document.body, 'rgaaExt-Body'),
		toggleClassEffect(document.body, 'rgaaExt-Body--withHelpers')
	]);

	revertEffects?.();
	revertEffects = apply();
};

export const revertActiveHelpers = () => {
	revertEffects?.();
	revertEffects = null;
};

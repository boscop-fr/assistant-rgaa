import {toggleClassEffect} from '../effects/dom';
import {highlightElementsEffect} from '../effects/highlight';
import effects from '../helpers';
import {
	type Effect,
	type Helper,
	type HelperName,
	type HelperOf,
	helperOptions
} from '../types';
import {combineEffects} from './effects';

let revertEffects: () => void;

// Some helpers only provide a widget in the panel, and no
// effect.
const helperEffects = <N extends HelperName>(helper: HelperOf<N>): Effect[] => {
	const apply = effects[helper.helper];
	return apply ? [apply(helperOptions(helper))] : [];
};

export const applyHelpers = (helpers: Helper[]) => {
	const effects = helpers.flatMap((helper): Effect[] => {
		try {
			return helperEffects(helper);
		} catch (e) {
			console.error(e);
			return [];
		}
	});

	const apply = combineEffects([
		...effects,
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

import {toggleClassEffect} from '../effects/dom';
import {type Highlight, highlightElementsEffect} from '../effects/highlight';
import {effects, highlights} from '../helpers';
import {
	type Effect,
	type Helper,
	type HelperName,
	type HelperOf,
	helperOptions
} from '../types';
import {combineEffects} from './effects';

let revertEffects: () => void;

// Some helpers only provide a widget in the panel, and
// neither an effect nor a highlight.
const helperEffect = <N extends HelperName>(helper: HelperOf<N>) =>
	effects[helper.helper]?.(helperOptions(helper));

const helperHighlight = <N extends HelperName>(helper: HelperOf<N>) =>
	highlights[helper.helper]?.(helperOptions(helper));

export const applyHelpers = (helpers: Helper[]) => {
	const helperEffects: Effect[] = [];
	const helperHighlights: Highlight[] = [];

	for (const helper of helpers) {
		try {
			const effect = helperEffect(helper);
			const highlight = helperHighlight(helper);

			if (effect) {
				helperEffects.push(effect);
			}

			if (highlight) {
				helperHighlights.push(highlight);
			}
		} catch (e) {
			console.error(e);
		}
	}

	const apply = combineEffects([
		...helperEffects,
		highlightElementsEffect(helperHighlights),
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

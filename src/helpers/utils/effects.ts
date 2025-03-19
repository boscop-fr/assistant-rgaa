import type {Effect} from '../types';

export const combineEffects =
	(effects: Effect[]): Effect =>
	() => {
		const reverters = effects.map((effect) => effect());

		return () => {
			for (const revert of reverters) {
				if (revert) {
					revert();
				}
			}
		};
	};

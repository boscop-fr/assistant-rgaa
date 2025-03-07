import type {Effect} from '../types';

export const combineEffects =
	(effects: Effect[]): Effect =>
	() => {
		const reverters = effects.map((effect) => effect());
		return () => {
			reverters.forEach((revert) => {
				if (revert) {
					revert();
				}
			});
		};
	};

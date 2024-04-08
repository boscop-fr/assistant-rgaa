// Executes an effect each time a subscriber emits a new value.
export const pollEffect = (subscribe, effect) => (action, api) => {
	// We want the effect to run only once and start a
	// background task.
	api.unsubscribe();
	api.fork(async () => {
		let {promise, resolve} = Promise.withResolvers();

		subscribe((value) => {
			resolve(value);
		});

		// eslint-disable-next-line no-constant-condition
		while (true) {
			// eslint-disable-next-line no-await-in-loop
			const value = await promise;
			({promise, resolve} = Promise.withResolvers());
			effect(value, api);
		}
	});
};

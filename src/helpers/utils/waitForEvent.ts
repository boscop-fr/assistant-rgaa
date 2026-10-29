// Waits for the next event of the given type.
// When `intercept` is set, the event is caught before the
// page sees it and its default action is prevented, so the
// page doesn't react to it.
const waitForEvent = <T extends keyof WindowEventMap>(
	event: T,
	intercept = false
) =>
	new Promise<WindowEventMap[T]>((resolve) => {
		const handler = (e: WindowEventMap[T]) => {
			if (intercept) {
				e.preventDefault();
				e.stopPropagation();
			}

			resolve(e);
		};

		window.addEventListener(event, handler, {
			capture: intercept,
			once: true
		});
	});

export default waitForEvent;

const waitForEvent = <T extends keyof DocumentEventMap>(event: T) =>
	new Promise<DocumentEventMap[T]>((resolve) => {
		const handler = (e: DocumentEventMap[T]) => {
			document.removeEventListener(event, handler);
			resolve(e);
		};

		document.addEventListener(event, handler);
	});

export default waitForEvent;

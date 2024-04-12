// Removes element matching given selector and its container
// if possible.
const hideHelperElement = (selector: string) => {
	document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
		const container = element.closest('.rgaaExt-HelperContainer');
		element.remove();

		if (!container.childElementCount) {
			container.remove();
		}
	});
};

export default hideHelperElement;

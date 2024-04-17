// Toggles all style sheets in the page.
const toggleStyleSheets = (toggled: boolean) => {
	Array.from(document.styleSheets).forEach((stylesheet) => {
		if (
			(stylesheet.ownerNode as HTMLElement)?.dataset?.['rgaaext'] ===
			undefined
		) {
			// eslint-disable-next-line no-param-reassign
			stylesheet.disabled = !toggled;
		}
	});
};

export default toggleStyleSheets;

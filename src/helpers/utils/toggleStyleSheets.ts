// Toggles all style sheets in the page.
const toggleStyleSheets = (toggled: boolean) => {
	Array.from(document.styleSheets).forEach((stylesheet) => {
		// eslint-disable-next-line no-param-reassign
		stylesheet.disabled = !toggled;
	});
};

export default toggleStyleSheets;

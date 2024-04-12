export type HTMLElementList = NodeListOf<HTMLElement> | HTMLElement[];

export const onDomLoaded = (callback: () => void) => {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', callback);
	} else {
		callback();
	}
};

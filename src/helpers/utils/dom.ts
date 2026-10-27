export type HTMLElementList = NodeListOf<HTMLElement> | HTMLElement[];

// @see http://stackoverflow.com/a/30930653
export const escapeHtml = (html: string) =>
	(
		document.createElement('div').appendChild(document.createTextNode(html))
			.parentNode as HTMLElement
	).innerHTML;

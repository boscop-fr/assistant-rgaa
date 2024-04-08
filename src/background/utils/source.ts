// Gets the source code of the page at the given URL.
export const getSource = (url: string) =>
	fetch(url).then((content) => content.text());

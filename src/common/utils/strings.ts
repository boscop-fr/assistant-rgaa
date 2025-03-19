// @see https://stackoverflow.com/a/8831937
export const hashCode = (str: string) => {
	let hash = 0;

	for (let i = 0, len = str.length; i < len; i++) {
		const chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}

	return hash.toString();
};

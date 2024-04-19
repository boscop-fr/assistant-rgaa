export const replaceLocalUrls = (body: string, basePath: string) =>
	body.replace(
		/(src=").\/([^"]+)(")/gi,
		(_, before, path, after) =>
			before + browser.runtime.getURL(`${basePath}/${path}`) + after
	);

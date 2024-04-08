export const replaceLocalUrls = (body: string, basePath: string) =>
	body.replace(/page:\/\/([a-z0-9/_-]+)/gi, (_, path) =>
		browser.runtime.getURL(`${basePath}/${path}`)
	);

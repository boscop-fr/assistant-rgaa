export const loadScript = (path: string, onLoad: () => void) => {
	const script = document.createElement('script');
	script.type = 'module';
	script.src = browser.runtime.getURL(path);
	script.onload = onLoad;
	document.body.appendChild(script);
};

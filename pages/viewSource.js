const api = typeof browser === 'undefined' ? chrome : browser;

api.runtime.onMessage.addListener((source) => {
	// Other extension messages are broadcast here as well.
	if (typeof source !== 'string') {
		return;
	}

	// biome-ignore lint/performance/useDomNodeTextContent: turns line breaks into <br>.
	document.querySelector('#sources').innerText = source;
});

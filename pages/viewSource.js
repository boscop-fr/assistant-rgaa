const api = typeof browser === 'undefined' ? chrome : browser;

api.runtime.onMessage.addListener((source) => {
	// Other extension messages are broadcast here as well.
	if (typeof source !== 'string') {
		return;
	}

	document.querySelector('#sources').innerText = source;
});

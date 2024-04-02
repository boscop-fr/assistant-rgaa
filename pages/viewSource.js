const api = typeof browser === 'undefined' ? chrome : browser;

api.runtime.onMessage.addListener((source) => {
	document.querySelector('#sources').innerText = source;
});

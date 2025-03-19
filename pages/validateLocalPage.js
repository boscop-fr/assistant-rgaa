const api = typeof browser === 'undefined' ? chrome : browser;

api.runtime.onMessage.addListener((source) => {
	document.querySelector('[name="fragment"]').value = source;
	document.querySelector('form').submit();
});

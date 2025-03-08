import {panelUnloaded} from '../background/slices/runtime';
import {loadScript} from '../common/utils/dom';

let minimap: HTMLElement;

// WebComponents can't be registered from content scripts,
// so we're bundling the minimap separately and loading it
// through a regular script tag.
loadScript('dist/minimap-component.js', () => {
	minimap = document.createElement('rgaaext-minimap');
	minimap.className = 'rgaaExt-VisibleWithHelpers ';
	document.body.appendChild(minimap);
});

browser.runtime.onMessage.addListener((action) => {
	if (panelUnloaded.match(action)) {
		minimap?.remove();
		minimap = null;
	}
});

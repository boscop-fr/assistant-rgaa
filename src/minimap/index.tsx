import {loadScript} from '../common/utils/dom';

// WebComponents can't be registered from content scripts,
// so we're bundling the minimap separately and loading it
// through a regular script tag.
loadScript('dist/minimap-component.js', () => {
	const minimap = document.createElement('rgaaext-minimap');
	minimap.className = 'rgaaExt-VisibleWithHelpers';
	document.body.appendChild(minimap);
});

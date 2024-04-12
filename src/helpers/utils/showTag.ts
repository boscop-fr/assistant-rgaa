import showCodeNearElement from './showCodeNearElement';

// Shows a box containing a tag's name on the given element.
const showTag = (id: string, element: HTMLElement) => {
	showCodeNearElement(element, `${element.tagName.toLowerCase()}`, {
		className: `${id} rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowTagHelper`
	});
};

export default showTag;

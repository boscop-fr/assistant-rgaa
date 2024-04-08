import $ from 'jquery';

// Stores helper containers indexed by their "parent" element.
const containers = new WeakMap();

const createContainer = (element: HTMLElement) => {
	const container = document.createElement('div');
	container.className = 'rgaaExt-HelperContainer';

	if (document.body.contains(element)) {
		$(element).after(container);
	} else {
		$(document.body).prepend(container);
	}

	return container;
};

// Returns a container associated with the given element,
// to be filled with helper contents.
const getContainer = (element: HTMLElement) => {
	const currentContainer = containers.get(element);

	if (currentContainer && currentContainer.parentNode) {
		return currentContainer;
	}

	const container = createContainer(element);
	containers.set(element, container);

	return container;
};

// Appends some code next to an element, ensuring that the
// code is visible in the page.
const showCodeNearElement = (element: JQuery, code: JQuery) => {
	$(getContainer(element.get(0))).append(code);
};

export default showCodeNearElement;

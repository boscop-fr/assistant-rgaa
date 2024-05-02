const CONTAINER_CLASS_NAME = 'rgaaExt-HelperContainer';

// Stores helper containers indexed by their "parent" element.
const containers = new WeakMap();

const createContainer = (element: HTMLElement) => {
	const container = document.createElement('div');
	container.className = CONTAINER_CLASS_NAME;

	if (document.body.contains(element)) {
		element.after(container);
	} else {
		document.body.insertAdjacentElement('afterbegin', container);
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
export const showCodeNearElement = (element: HTMLElement, html: string) => {
	getContainer(element).insertAdjacentHTML(
		'beforeend',
		`<code class="rgaaExt-Helper rgaaExt-Mappable">${html}</code>`
	);
};

export const removeCodeNearElement = (element: HTMLElement) => {
	const next = element.nextElementSibling;

	if (next?.classList.contains(CONTAINER_CLASS_NAME)) {
		next.remove();
	}
};

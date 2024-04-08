import $ from 'jquery';

// Removes element matching given selector and its container
// if possible.
const hideHelperElement = (selector: string) => {
	const container = $(selector).closest('.rgaaExt-HelperContainer');
	$(selector).remove();
	if (!container.children().length) {
		container.remove();
	}
};

export default hideHelperElement;

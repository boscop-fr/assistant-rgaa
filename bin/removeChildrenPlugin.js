/**
 *
 */
const removeChildrenPlugin = ($) => {
	$.prototype.removeChildren = function (selector) {
		this.find(selector).remove();
		return this;
	};
};

export default removeChildrenPlugin;

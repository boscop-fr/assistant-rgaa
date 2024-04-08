import $ from 'jquery';
import {lowerCase} from 'lodash';
import showCodeNearElement from './showCodeNearElement';

// Shows a box containing a tag's name on the given element.
const showTag = (id: string, element: JQuery) => {
	showCodeNearElement(
		element,
		$('<code />', {
			class: `${id} rgaaExt-Helper rgaaExt-Helper--mappable rgaaExt-ShowTagHelper`,
			html: `${lowerCase(element.get(0).tagName)}`
		})
	);
};

export default showTag;

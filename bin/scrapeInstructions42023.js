#!/usr/bin/env node
import {marked} from 'marked';

/**
 * marked js Renderer
 */
const renderer = new marked.Renderer();

/**
 *
 * @param {string} href
 * @param {string} title
 * @param {string | null} text
 * @returns {string}
 */
renderer.link = (href, title, text) =>
	`<a  href="https://accessibilite.numerique.gouv.fr/methode/glossaire/${href}" target="_blank" title="${
		title ?? text
	}">${text}</a>`;

/**
 *	Scrapes version 4 of the RGAA instructions into JSON.
 *
 *	@param {object} options - Options:
 *		- {string} source - Source URL.
 *		- {string} destination - Destination file.
 *		- {boolean} merge - Whether or not to merge the output
 *			file with the existing one, if any.
 */
export default (options) => (json) => {
	if (!json || typeof json !== 'string') {
		throw new Error('RGAA Criteria  Json file missing');
	}
	const rgaaInstructionJson = JSON.parse(json);
	return parseInstructions(rgaaInstructionJson);
};

/**
 *
 * @param {object} rgaaInstructionJson
 * @returns {object} Object
 */
function parseInstructions(rgaaInstructionJson) {
	const instructionsJSon = {};
	for (const key in rgaaInstructionJson) {
		instructionsJSon[key] = {
			rgaa: marked(rgaaInstructionJson[key])
		};
	}
	return instructionsJSon;
}

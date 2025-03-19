#!/usr/bin/env node
import {marked} from 'marked';

const accessGouvUrl =
	'https://accessibilite.numerique.gouv.fr/methode/glossaire/';
const w3cTechniquesUrl = 'https://www.w3.org/WAI/WCAG21/Techniques/';
const w3cWcag21FrUrl = 'https://www.w3.org/Translations/WCAG21-fr/';

function externalLinksRenderer(link) {
	const renderer = new marked.Renderer();

	renderer.link = (href, title, text) => {
		const matches = href.match(/(https?:\/\/[^\s]+)/g);
		const newHref = matches ? matches[0] : link + href;
		const newTitle = `${title ?? text} - nouvelle fenêtre`;

		return `<a href="${newHref}" title="${newTitle}" target="_blank">${text}</a>`;
	};

	return renderer;
}

/**
 *	Transforms data from version 4.1 of the RGAA reference into JSON.
 *
 *	@param {object} options - Options:
 *		- {string} source - Source URL.
 *		- {string} destination - Destination file.
 *		- {boolean} merge - Whether or not to merge the output
 *		- file with the existing one, if any.
 */
export default (json) => {
	if (!json || typeof json !== 'string') {
		throw new Error('RGAA Criteria  Json file missing');
	}
	const rgaaJson = JSON.parse(json);
	return {
		name: 'RGAA 4.1.2 (2023)',
		version: '4.1.2',
		themes: buildThemes(rgaaJson)
	};
};

/**
 * @param {object} rgaaJsonCriteria
 * @returns {Array} Array
 */
function buildThemes(rgaaJsonCriteria) {
	return rgaaJsonCriteria.topics.map((topic) => ({
		id: `${topic.number}`,
		title: `${topic.number}. ${topic.topic}`,
		criteria: parseCriteria(topic.criteria, topic.number)
	}));
}

/**
 * @param {object} criterias
 * @param {string} topicNumber
 * @returns  {object} Object
 */
function parseCriteria(criterias, topicNumber) {
	return criterias.map((criteria) => ({
		id: `${topicNumber}.${criteria.criterium.number}`,
		title: marked(criteria.criterium.title, {
			renderer: externalLinksRenderer(accessGouvUrl)
		}),
		level: `${parseWcagCriteria(criteria.criterium.references[0]?.wcag[0]).level}`,
		tests: getTests(
			criteria.criterium.tests,
			criteria.criterium.number,
			topicNumber
		),
		specialCases: formatNotesToMarkdown(criteria.criterium?.particularCases),
		technicalNotes: formatNotesToMarkdown(criteria.criterium?.technicalNote),
		references: {
			wcag: {
				criteria:
					marked(getWcagCriteria(criteria.criterium.references[0]?.wcag), {
						renderer: externalLinksRenderer(w3cWcag21FrUrl)
					}) || undefined,
				techniques:
					marked(
						getWcagTechniques(criteria.criterium.references[1]?.techniques),
						{
							renderer: externalLinksRenderer(w3cTechniquesUrl)
						}
					) || undefined
			}
		}
	}));
}

/**
 * @param {string} wcag
 * @returns {string} String
 */
function parseWcagCriteria(title) {
	const matches = title.match(/^(\d+\.\d+\.\d+) (.+) \((A+)\)/i);
	return {
		id: matches ? matches[1] : '',
		title: matches ? matches[2] : '',
		level: matches ? matches[3] : ''
	};
}

/**
 * @param {object} tests
 * @param {number} criteriumId
 * @param {string} topicNumber
 * @return {Array<object>} Array[object]
 */
function getTests(tests, criteriumId, topicNumber) {
	return Object.entries(tests).map(([key, test]) => ({
		id: `${topicNumber}.${criteriumId}.${key}`,
		title: marked(formatTest(test), {
			renderer: externalLinksRenderer(accessGouvUrl)
		})
	}));
}

/**
 * @param {array<string>} lines
 * @return {string} String
 */
function formatTest(lines) {
	const paragraph = lines.shift();
	const list = lines.map((line) => `* ${line}`);
	return [paragraph, ...list].join('\n');
}

function wcagTitleSlug(title) {
	return title
		.toLowerCase()
		.replace(/\s/g, '-')
		.replace(/[^\w-]/g, '');
}

/**
 * @param {array} wcag
 */
function getWcagCriteria(titles) {
	return titles
		.map(parseWcagCriteria)
		.map(({id, title, level}) => {
			const anchor = title ? `#${wcagTitleSlug(title)}` : '';

			return ` * [${id} (${level})](${anchor})`;
		})
		.join('\n');
}

const wcagCategories = {
	H: 'html',
	G: 'general',
	C: 'css',
	F: 'failures',
	A: 'aria',
	S: 'client-side-script'
};
/**
 * @param {object} techniques
 * @returns {string} String
 */
function getWcagTechniques(techniques) {
	const values = Object.values(techniques);

	if (!values.length) {
		return '';
	}

	const buildMdLink = (uri, ref) => `[${ref.join('')}](${uri}/${ref.join('')})`;
	return values
		.map((v) => {
			const ref = v.split('');
			return ` * ${buildMdLink(wcagCategories[ref[0]], ref)}`;
		})
		.join(' \n');
}

/**
 *
 * @param {Array<object|string>|undefined} notes
 */
function formatNotesToMarkdown(notes) {
	if (!notes) {
		return undefined;
	}

	return notes
		.map((note) => {
			const content =
				typeof note === 'string'
					? note
					: note.ul.map((item) => item.replace(/ ;$/, '')).join('\n');

			return marked(content, {
				renderer: externalLinksRenderer(accessGouvUrl)
			});
		})
		.join('');
}

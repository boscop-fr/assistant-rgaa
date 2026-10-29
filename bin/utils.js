import fs from 'node:fs';

/**
 *
 */
const readJson = (path) => {
	const body = fs.readFileSync(path, 'utf-8');
	const json = JSON.parse(body);

	return json || {};
};

/**
 *
 */
const jsonify = (data) => JSON.stringify(data, null, '\t');

/**
 *
 */
const writeJsonTo = (path) => (data) => {
	fs.writeFileSync(path, jsonify(data));
};

/**
 *
 */
export default {
	readJson,
	jsonify,
	writeJsonTo
};

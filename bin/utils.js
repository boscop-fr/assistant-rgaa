const deepmerge = require('deepmerge');
const fs = require('fs');
const request = require('request');

/**
 *
 */
const fetchFrom = (url) =>
	new Promise((resolve, reject) =>
		request(url, (error, response, body) => {
			if (error) {
				resolve(body);
			} else if (response.statusCode !== 200) {
				reject(`Error ${response.statusCode}`);
			} else {
				resolve(body);
			}
		})
	);

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
const writeJsonTo = (path, merge) => (data) => {
	const oldData = readJson(path);
	const newData = merge ? deepmerge(oldData, data) : data;

	fs.writeFileSync(path, jsonify(newData));
};

/**
 *
 */
const logError = (error) => console.error(error);

/**
 *
 */
module.exports = {
	fetchFrom,
	readJson,
	jsonify,
	writeJsonTo,
	logError
};

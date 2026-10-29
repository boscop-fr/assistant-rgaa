import utils from './utils.js';

const formatToType = (data, type) =>
	Object.fromEntries(
		Object.entries(data).map(([id, instruction]) => [id, {[type]: instruction}])
	);

const format = (options) => {
	const data = utils.readJson(options.source);
	const formatted = formatToType(data, 'rgaa');
	return utils.writeJsonTo(options.dest)(formatted);
};

export default format;

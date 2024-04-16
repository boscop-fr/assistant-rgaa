const utils = require('./utils');



const formatToType = (data, type) =>
	Object.fromEntries(
		Object.values(data).map((instruction) => ({
			[type]: instruction
		}))
	)

const format = (options) => {
	const data = utils.readJson(options.source);
	const formatted = formatToType(data, 'rgaa');
	return utils.writeJsonTo(options.dest, false)(formatted);
};

module.exports = format;

const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const {ProvidePlugin} = require('webpack');

const fullPath = path.resolve.bind(null, __dirname);
const devMode = process.env.NODE_ENV !== 'production';
const plugins = [
	new MiniCssExtractPlugin({
		filename: '[name].css'
	}),
	new ProvidePlugin({
		browser: 'webextension-polyfill'
	})
];

if (devMode) {
	plugins.push(
		new ESLintPlugin({
			extensions: ['ts', 'tsx']
		}),
		new StyleLintPlugin({
			failOnError: false,
			context: 'css'
		})
	);
}

const jsonLintRule = (include, type) => ({
	test: /\.json$/,
	type: 'javascript/auto',
	include,
	use: [
		{
			loader: 'ts-loader'
		},
		{
			loader: fullPath('loaders/json-lint-loader'),
			options: {
				typesPath: fullPath('src/common/types.ts'),
				type
			}
		}
	]
})

module.exports = {
	mode: devMode
		? 'development'
		: 'production',
	entry: {
		'default-panel': [
			'./src/default-panel/index',
			'./css/default-panel/index.css'
		],
		panel: [
			'./src/panel/index',
			'./css/panel/index.css'
		],
		helpers: [
			'./src/helpers/index',
			'./css/helpers/index.css'
		],
		minimap: [
			'./src/minimap/index'
		],
		options: [
			'./src/options/index',
			'./css/options/index.css'
		],
		background: [
			'./src/background/index'
		],
		// This entry is used solely to validate JSON data
		// against application types.
		data: './data/lint'
	},
	output: {
		path: fullPath('dist'),
		publicPath: 'dist',
		filename: '[name].js'
	},
	devtool: 'source-map',
	devServer: {
		historyApiFallback: true,
		writeToDisk: true
	},
	resolve: {
		extensions: ['.tsx', '.ts', '...'],
		fallback: {
			buffer: false
		}
	},
	module: {
		rules: [
			jsonLintRule(fullPath('data/references'), 'Reference'),
			jsonLintRule(fullPath('data/instructions'), 'InstructionsByTest'),
			jsonLintRule(fullPath('data/helpers'), 'HelpersByTest'),
			{
				test: /\.tsx?$/,
				include: [fullPath('src'), fullPath('data')],
				use: [
					{
						loader: 'ts-loader'
					},
					{
						loader: 'prettier-loader',
						options: {
							ignoreInitial: true
						}
					}
				]
			},
			{
				// Custom CSS build for the minimap styles, as
				// they are injected as a string into a shadow
				// DOM.
				test: /\.css$/,
				include: fullPath('css/minimap'),
				use: [
					{
						loader: 'css-loader',
						options: {
							url: false,
							exportType: 'string'
						}
					}
				]
			},
			{
				test: /\.css$/,
				include: fullPath('css'),
				exclude: fullPath('css/minimap'),
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					}
				]
			}
		]
	},
	plugins
};

const path = require('path');
const autoprefixer = require('autoprefixer');
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
		new ESLintPlugin(),
		new StyleLintPlugin({
			failOnError: false,
			context: 'css',
			syntax: 'scss'
		})
	);
}

// @see https://webpack.js.org/plugins/mini-css-extract-plugin/#extracting-css-based-on-entry
const recursiveIssuer = (m, c) => {
	const issuer = c.moduleGraph.getIssuer(m);

	if (issuer) {
		return recursiveIssuer(issuer, c);
	}

	const chunks = c.chunkGraph.getModuleChunks(m);
	return chunks.length
		? chunks[0].name
		: false;
};

const styleCacheGroup = (name) => ({
	name,
	chunks: 'all',
	enforce: true,
	test: (m, c, entry = name) =>
		m.constructor.name === 'CssModule'
		&& recursiveIssuer(m, c) === entry
});

module.exports = {
	mode: devMode
		? 'development'
		: 'production',
	entry: {
		'default-panel': [
			'./src/default-panel/index',
			'./css/default-panel/index.scss'
		],
		panel: [
			'./src/panel/index',
			'./css/panel/index.scss'
		],
		helpers: [
			'./src/helpers/index',
			'./css/helpers/index.scss'
		],
		options: [
			'./src/options/index',
			'./css/options/index.scss'
		],
		background: [
			'./src/background/index'
		]
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
		fallback: {
			buffer: require.resolve('buffer')
		}
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				containerStyles: styleCacheGroup('container'),
				helpersStyles: styleCacheGroup('helpers'),
				optionsStyles: styleCacheGroup('options'),
				defaultPanelStyles: styleCacheGroup('default-panel'),
				panelStyles: styleCacheGroup('panel')
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: fullPath('src'),
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true
						}
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
				test: /\.scss$/,
				include: fullPath('css'),
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									autoprefixer()
								]
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								quietDeps: true
							}
						}
					}
				]
			},
			{
				test: /\.json$/,
				use: 'json'
			}
		]
	},
	plugins
};

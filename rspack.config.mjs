import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import {defineConfig} from '@rspack/cli';
import rspack from '@rspack/core';
import StyleLintPlugin from 'stylelint-webpack-plugin';
import RemarkHTML from 'remark-html';

const fullPath = path.resolve.bind(null, process.cwd());
const devMode = process.env.NODE_ENV === 'development';

const jsonLintRule = (include, type) => ({
	test: /\.json$/,
	type: 'javascript/auto',
	include,
	use: [
		{
			loader: 'builtin:swc-loader',
			options: {
				sourceMap: true,
				jsc: {
					parser: {
						syntax: 'typescript'
					}
				}
			}
		},
		{
			loader: fullPath('loaders/json-lint-loader'),
			options: {
				typesPath: fullPath('src/common/types.ts'),
				type
			}
		}
	]
});

export default defineConfig({
	mode: devMode ? 'development' : 'production',
	entry: {
		'default-panel': [
			'./src/default-panel/index',
			'./css/default-panel/index.css'
		],
		panel: ['./src/panel/index', './css/panel/index.css'],
		helpers: ['./src/helpers/index', './css/helpers/index.css'],
		minimap: ['./src/minimap/index'],
		'minimap-component': ['./src/minimap/component'],
		options: ['./src/options/index', './css/options/index.css'],
		background: ['./src/background/index'],
		// This entry is used solely to validate JSON data
		// against application types.
		data: './data/lint'
	},
	output: {
		path: fullPath('dist'),
		publicPath: 'dist',
		filename: '[name].js',
		clean: true
	},
	devtool: 'source-map',
	experiments: {
		css: false
	},
	resolve: {
		extensions: ['.tsx', '.ts', '...'],
		fallback: {
			buffer: false
		},
		alias: {
			react: 'preact/compat',
			'react-dom': 'preact/compat',
			'react/jsx-runtime': 'preact/jsx-runtime'
		}
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: [fullPath('src'), fullPath('data')],
				use: [
					{
						loader: 'builtin:swc-loader',
						options: {
							sourceMap: true,
							jsc: {
								parser: {
									syntax: 'typescript'
								},
								transform: {
									react: {
										development: devMode,
										runtime: 'automatic',
										importSource: 'preact'
									}
								}
							}
						}
					}
				].concat(
					devMode
						? [
								{
									loader: 'prettier-loader',
									options: {
										ignoreInitial: true
									}
								}
							]
						: []
				)
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
					rspack.CssExtractRspackPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							url: false
						}
					}
				]
			},
			{
				test: /\.md$/,
				include: fullPath('data/pages'),
				type: 'asset/source',
				use: [
					{
						loader: 'remark-loader',
						options: {
							remarkOptions: {
								plugins: [RemarkHTML]
							}
						}
					}
				]
			},
			jsonLintRule(fullPath('data/references'), 'Reference'),
			jsonLintRule(fullPath('data/instructions'), 'InstructionsByTest'),
			jsonLintRule(fullPath('data/helpers'), 'HelpersByTest')
		]
	},
	plugins: [
		new rspack.CssExtractRspackPlugin(),
		new rspack.ProvidePlugin({
			browser: 'webextension-polyfill'
		}),
		new rspack.IgnorePlugin({
			resourceRegExp: /\.woff$/
		})
	].concat(
		devMode
			? [
					new ESLintPlugin({
						extensions: ['ts', 'tsx']
					}),
					new StyleLintPlugin({
						failOnError: false,
						context: 'css'
					})
				]
			: []
	)
});

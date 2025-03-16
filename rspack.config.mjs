import path from 'node:path';
import {defineConfig} from '@rspack/cli';
import rspack from '@rspack/core';
import manifest from './manifest.json' with {type: 'json'};
import pkg from './package.json' with {type: 'json'};

const fullPath = path.resolve.bind(null, process.cwd());
const devMode = process.env.NODE_ENV === 'development';

const jsonLintRule = (include, type) => ({
	test: /\.json$/,
	type: 'javascript/auto',
	include,
	use: [
		fullPath('loaders/null-loader'),
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
		futureDefaults: true
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
							env: {
								targets: pkg.browserslist
							},
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
				]
			},
			{
				// Custom CSS build for the minimap styles, as
				// they are injected as a string into a shadow
				// DOM.
				test: /\.css$/,
				type: 'javascript/auto',
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
			jsonLintRule(fullPath('data/references'), 'Reference'),
			jsonLintRule(fullPath('data/instructions'), 'InstructionsByTest'),
			jsonLintRule(fullPath('data/helpers'), 'HelpersByTest')
		]
	},
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: {
					targets: pkg.browserslist
				}
			})
		]
	},
	plugins: [
		new rspack.EnvironmentPlugin({
			VERSION: manifest.version
		}),
		new rspack.ProvidePlugin({
			browser: 'webextension-polyfill'
		}),
		new rspack.IgnorePlugin({
			resourceRegExp: /\.woff$/
		})
	]
});

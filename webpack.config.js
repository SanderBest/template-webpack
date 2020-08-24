const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const getFilename = ext => (isDev ? `[name].${ext}` : `[name].[hash]..${ext}`);

const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
		},
	};

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsWebpackPlugin(),
			new TerserWebpackPlugin(),
		];
	}

	return config;
};

const getCssLoader = param => {
	const loader = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true,
			},
		},
		'css-loader',
	];

	if (param) {
		loader.push(param);
	}
	return loader;
};

const getPlugins = () => {
	const base = [
		new HTMLWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/favicon.png'),
					to: path.resolve(__dirname, 'dist'),
				},
			],
		}),
		new MiniCssExtractPlugin({
			filename: getFilename('.css'),
		}),
	];
	if (isProd) {
		base.push(new BundleAnalyzerPlugin());
	}

	return base;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		main: ['@babel/polyfill', './index.js'],
		analytics: './analytics.js',
	},
	output: {
		filename: getFilename('.js'),
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.json', '.png', '.jpg', '.svg', '.css'],
		alias: {
			'@models': path.resolve(__dirname, 'src/models'),
			'@': path.resolve(__dirname, 'src'),
		},
	},
	optimization: optimization(),
	devServer: {
		port: 8080,
		hot: isDev,
	},
	plugins: getPlugins(),
	module: {
		rules: [
			{
				test: /\.css$/,
				use: getCssLoader(),
			},
			{
				test: /\.s[ac]ss$/,
				use: getCssLoader('sass-loader'),
			},
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							// optipng.enabled: false will disable optipng
							optipng: {
								enabled: false,
							},
							pngquant: {
								quality: [0.65, 0.9],
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							// the webp option will enable WEBP
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ['file-loader'],
			},
			{
				test: /\.xml$/,
				use: ['xml-loader'],
			},
			{
				test: /\.csv$/,
				use: ['csv-loader'],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-class-properties'],
					},
				},
			},
		],
	},
};

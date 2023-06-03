const
	webpackPreprocessor = require('@cypress/webpack-preprocessor'),
	webpackOptions = {
		mode: 'development',
		devtool: 'module-source-map', // See https://survivejs.com/webpack/building/source-maps/
		// devtool: 'cheap-module-source-map', // See https://survivejs.com/webpack/building/source-maps/
		module: {
			rules: [
				{
					test: /\.(js|jsx|mjs)$/,
					exclude: /node_modules/,
					// exclude: /node_modules\/(?!(@onehat)\/).*/,
					loader: 'babel-loader',
					options: {
						cacheDirectory: false,
						presets: [
							'@babel/preset-env'
						],
						plugins: [
							'@babel/plugin-proposal-class-properties',
							'@babel/plugin-transform-runtime'
						],
						sourceType: 'unambiguous',
					},
				}
			]
		}
	};

module.exports = (on) => {
	on('file:preprocessor', webpackPreprocessor({
		webpackOptions,
		watchOptions: {},
	}));
}
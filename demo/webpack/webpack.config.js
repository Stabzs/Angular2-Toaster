const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path')

module.exports = {
	entry: {
		"polyfills": "./src/polyfills.ts",
		"main": "./src/main.ts"
	},
	output: {
		path: path.resolve(__dirname, 'dist'), // output directory
		filename: "[name].js" // name of the generated bundle
	},
	devtool: 'source-map',
	devServer: {
		historyApiFallback: true
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
			{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
			{ test: /\.ts$/, use: { loader: 'ts-loader' } }
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		})
	]
};
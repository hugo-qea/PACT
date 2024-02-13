const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
// const appDirectory = fs.realpathSync(process.cwd());

module.exports = {
	entry: path.resolve("client/src/app.js"), //path to the main .ts file
	output: {
		path: path.resolve("./dist"),
 		filename: "js/bundle.js", //name for the js file that is created/compiled in memory
 		clean: true,
 	},
 	/* resolve: {
 		extensions: [".tsx", ".ts", ".js"],
 	},
 	devServer: {
 		host: "0.0.0.0",
 		port: 8080, //port that we're using for local host (localhost:8080)
 		static: path.resolve("public"), //tells webpack to serve from the public folder
		hot: true,
		devMiddleware: {
 			publicPath: "/",
		}
	}, */

	plugins: [
		new ESLintPlugin(),
		/* new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve("client/game.html"),
			filename: "game.html"
		}) */
	],
};

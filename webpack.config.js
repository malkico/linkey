const path = require('path');

module.exports = {
  mode: "production",
  watch: true,
  entry: {
    polyfill: "babel-polyfill",
    follower: [
	"./public/javascripts/index.js"
	]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public/dist")
  },
	module: {
	rules: [
	  {
		test: /\.js$/,
		exclude: [/node_modules/, /bin/, /config/, /controllers/, /insta link/, /middlwares/, /models/, /routes/, /sockets/],
		use: {
		  loader: "babel-loader",
		  options: {
			presets: ["@babel/preset-env"]
		  }
		}
	  }
	]
  }

};
const path = require('path');

module.exports = {
  mode: "production",
  watch: true,
  entry: {
    follower: [
	"./public/javascripts/index.js"
	]
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public/dist")
  }
};
module.exports = {
  context: __dirname,
  entry: "./js/appRunner.js",
  output: {
    path: "./js",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: 'source-map',
};

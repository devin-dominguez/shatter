module.exports = {
  context: __dirname,
  entry: "./lib/appRunner.js",
  output: {
    path: "./lib",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js"]
  },
  devtool: 'source-map',
};

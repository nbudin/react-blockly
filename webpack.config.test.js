const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: ["./src/dev-index.tsx"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react-blockly.js",
  },
  devtool: "source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {},
};

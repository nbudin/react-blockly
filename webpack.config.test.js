const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
          loader: require.resolve("ts-loader"),
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, require.resolve("css-loader")],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {},
};

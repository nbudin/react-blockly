const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './src/dev-index.jsx',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react-blockly-component.js',
    libraryTarget: 'var',
    library: 'ReactBlocklyComponent',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: './public',
    filename: 'react-blockly-component.js',
  },
};

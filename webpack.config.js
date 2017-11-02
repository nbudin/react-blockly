const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "react-blockly-component.js",
    libraryTarget: "var",
    library: "ReactBlocklyComponent"
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    contentBase: './public',
    filename: 'react-blockly-component.js'
  }
};

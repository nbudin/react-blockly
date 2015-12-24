var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: './dist/',
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
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    contentBase: './public',
    filename: 'react-blockly-component.js'
  }
};
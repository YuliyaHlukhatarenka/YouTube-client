const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: path.join(__dirname, './src/index.js'),

  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/public/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.html$/, loader: 'html-loader',
      },
      {
        test: /\.scc$/, loader: ['style-loader', 'css-loader'],
      },
    ],
  },

};

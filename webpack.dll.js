const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    react: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
    antd: ['antd'],
  },
  mode: 'development',
  devtool: 'source-map',
  context: __dirname,
  plugins: [
    new webpack.DllPlugin({
       name: '[name]',
       path: path.join(__dirname, 'cache/[name].dll.json'),
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.css', '.less', '.json'],
  },
  output: {
    library: '[name]',
    filename: '[name].dll.js',
    path: path.join(__dirname, 'cache'),
  },
};

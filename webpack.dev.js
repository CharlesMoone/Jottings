const path = require('path');

module.exports = {
  entry: {
    index: path.join(__dirname, 'client/js/index.mjs'),
  },
  mode: 'development',
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.mjs', '.css', '.json'],
  },
  output: {
    jsonpScriptType: 'module',
    filename: 'js/[name].bundle.mjs',
    chunkFilename: 'js/[name].bundle.mjs',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.mtmp$/,
        use: ['./loader'],
      },
    ],
  },
};

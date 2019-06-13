const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

require('dotenv').config();

const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [['@babel/preset-env', { targets: '> 2.486%, not dead' }], '@babel/preset-react'],
    plugins: [
      ['@babel/plugin-syntax-dynamic-import'],
      ['@babel/plugin-proposal-class-properties'],
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ],
  },
};

const styleLoader = {
  loader: 'style-loader',
  options: {
    insertAt: { before: 'link' },
  },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: 1,
    localIdentName: '[local]-[name]-[hash:base64:5]',
  },
};

const lessLoader = {
  loader: 'less-loader',
  options: {
    javascriptEnabled: true,
  },
};

module.exports = {
  entry: {
    index: path.join(__dirname, 'client/index.jsx'),
    banner: path.join(__dirname, 'webcomponent/cm-banner/index.mjs'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: process.env.BUILD_TITLE,
      filename: 'sys.html',
      template: path.join(__dirname, 'public/sys.html'),
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
      hash: true,
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'public/index.html'),
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
      inject: 'head',
      hash: true,
      chunks: ['banner'],
    }),
    new ScriptExtHtmlWebpackPlugin({
      async: 'banner',
      module: 'banner',
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.css', '.less', '.json'],
    alias: {
      '@becu/plugin-fetch/Auth': path.join(__dirname, 'client', 'AuthConf.json'),
    },
  },
  output: {
    jsonpScriptType: 'module',
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [babelLoader],
      },
      {
        test: /\.less$/,
        use: [styleLoader, 'css-loader', lessLoader],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [styleLoader, 'css-loader'],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [styleLoader, cssLoader],
      },
      {
        test: /\.(png|jpg|gif|svg|webp|webm|jpeg|bmp|eot|otf|ttf|woff|woff2|mp4|wav|mp3|m4a|aac|oga)$/,
        use: 'file-loader',
      },
      {
        test: /\.mtmp$/,
        use: './loader',
      },
    ],
  },
};

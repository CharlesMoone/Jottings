const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
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

// 涉及到的 webcomponent 组件
const webcomponent = ['banner', 'article', 'content'];

/**
 * 给 target.html 内置 contains 的 mjs
 * [target, contains]
 * @param { String } target 要插入 mjs 的 html
 * @param { StringArray } contains 需要插入到 html 的 mjs 的数组
 *
 * @return { HtmlWebpackPluginArray } 实例化 HtmlWebpackPlugin 对象的数组
 */
const htmlWebpackPlugin = [
  ['article', 'article'],
  ['content', 'content'],
  ['index', 'banner', 'article'],
].map(([target, ...contains]) => new HtmlWebpackPlugin({
  filename: `${target}.html`,
  template: path.join(__dirname, `public/${target}.html`),
  meta: {
    viewport: 'width=device-width, initial-scale=1',
  },
  inject: 'head',
  hash: true,
  chunks: contains,
}));

/**
 * 给 target.html 内置 contains 的 css
 * [target, contains]
 * @param { String } target 要插入 css 的 html
 * @param { StringArray } contains 需要插入到 html 的 css 的数组
 *
 * @return { AddAssetHtmlPluginArray } 实例化 AddAssetHtmlPluginArray 对象的数组
 */
const addAssetHtmlPlugin = [
  ['common', 'sys'],
  ['main', 'index', 'article', 'content'],
  ['reset', 'index', 'article', 'content'],
].map(([target, ...contains]) => new AddAssetHtmlPlugin({
  filepath: path.join(__dirname, `public/css/${target}.css`),
  files: contains.map(item => `${item}.html`),
  hash: true,
  typeOfAsset: 'css',
  outputPath: 'css',
  publicPath: '/css',
}));

module.exports = {
  entry: {
    index: path.join(__dirname, 'client/index.jsx'),
    ...webcomponent.reduce((origin, parent) => ({
      ...origin,
      [parent]: path.join(__dirname, `webcomponent/cm-${parent}/index.mjs`),
    }), {}),
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
    new ScriptExtHtmlWebpackPlugin({
      async: webcomponent,
      module: webcomponent,
    }),
    ...htmlWebpackPlugin,
    ...addAssetHtmlPlugin,
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

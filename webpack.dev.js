const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const common = require('./webpack.common.js');

const toBoolean = val => {
  if (typeof val === 'boolean') return val;
  if (!val) return false;
  const num = Number(val);
  if (!(Object.is(num, NaN) || num)) return false;
  if (typeof val === 'string' && val.toLowerCase() === 'false') return false;
  return true;
};

const devProxyRegex = process.env.DEV_PROXY_REGEX && new RegExp(process.env.DEV_PROXY_REGEX);

const devServerConfig = {};
if (toBoolean(process.env.DEV_PROXY)) {
  devServerConfig.proxy = [
    {
      target: process.env.DEV_PROXY_TARGET,
      changeOrigin: true,
      secure: !toBoolean(process.env.DEV_PROXY_INSECURE),
      pathRewrite(path, req) {
        if (!(devProxyRegex && process.env.DEV_PROXY_REGEX_REWRITE)) {
          return path;
        }
        return path.replace(devProxyRegex, process.env.DEV_PROXY_REGEX_REWRITE);
      },
      context(pathname, req) {
        // 正则
        if (devProxyRegex && devProxyRegex.test(pathname)) {
          return true;
        }
        // 前缀
        if (process.env.DEV_PROXY_PREFIX && pathname.startsWith(process.env.DEV_PROXY_PREFIX)) {
          return true;
        }
        // 自动判断
        if (!toBoolean(process.env.DEV_PROXY_AUTO)) {
          // 未开启自动判断
          return false;
        }
        if (req.method !== 'GET') {
          // 非 GET 请求全部 proxy
          return true;
        }
        if (fs.existsSync(path.join(__dirname, 'public', pathname))) {
          // public 目录下的文件
          return false;
        }
        return !(req.headers.accept && /\btext\/html\b/.test(req.headers.accept));
      },
      onProxyReq(req) {
        if (req.getHeader('origin')) {
          req.setHeader('origin', process.env.DEV_PROXY_TARGET);
        }
      },
    },
  ];
}

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    ...devServerConfig,
    contentBase: [path.join(__dirname, 'public')],
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /^\/(?!sys(\/|$))/, to: '/index.html' },
        { from: /^\/sys(\/|$)/, to: '/sys.html' },
      ],
    },
    host: 'localhost', // bind DEV server to localhost
    // host: '::',  // bind DEV server to [::]
    hot: true,
    inline: true,
    overlay: true,
    port: 8080, // bidn DEV server on port 8080
    progress: true,
  },
  plugins: [
    ...glob
      .sync(path.join(__dirname, 'cache/*.dll.json'))
      .map(manifest => new webpack.DllReferencePlugin({ manifest })),
    new AddAssetHtmlPlugin({
      filepath: path.join(__dirname, 'cache/*.dll.js'),
      hash: true,
    }),
    new AddAssetHtmlPlugin({
      filepath: path.join(__dirname, 'public/css/common.css'),
      files: 'sys.html',
      hash: true,
      typeOfAsset: 'css',
      outputPath: 'css',
      publicPath: '/css',
    }),
    new AddAssetHtmlPlugin({
      filepath: path.join(__dirname, 'public/css/main.css'),
      files: 'index.html',
      hash: true,
      typeOfAsset: 'css',
      outputPath: 'css',
      publicPath: '/css',
    }),
    new AddAssetHtmlPlugin({
      filepath: path.join(__dirname, 'public/css/reset.css'),
      files: 'index.html',
      hash: true,
      typeOfAsset: 'css',
      outputPath: 'css',
      publicPath: '/css',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
});

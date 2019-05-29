const path = require('path');
const merge = require('webpack-merge');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    // Generate SourceMap File Out of '/dist/'
    sourceMapFilename: '../dist.map/[file].map',
    publicPath: `${process.env.BUILD_PUBLIC_PATH}${
      process.env.BUILD_PUBLIC_PATH.endsWith('/') ? '' : '/'
    }`,
  },
  plugins: [
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
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.join(__dirname, 'dist/*'),
        path.join(__dirname, 'dist.map/*'),
        path.join(__dirname, 'bundle-analyzer-report.html'),
      ],
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'public'),
        to: path.join(__dirname, 'dist/'),
        force: true,
        ignore: ['*.html', 'css/**/*'],
      },
    ]),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: path.join(__dirname, 'bundle-analyzer-report.html'),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
      minSize: 80000,
      maxSize: 250000,
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 8,
        },
        sourceMap: true,
      }),
    ],
  },
});

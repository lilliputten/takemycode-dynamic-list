// @ts-check

const path = require('path');

// const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  isDev,
  // isDebug,
  // projectInfo,
  outPath,
  devtool,
  minimizeAssets,
  scriptsAssetFile,
} = require('./webpack.params');

const maxAssetSize = 8 * 1024;

module.exports = {
  mode: isDev ? 'development' : 'production',
  // @see https://webpack.js.org/configuration/devtool/#devtool
  devtool,
  entry: [
    // NOTE: See also `files` field in `tsconfig.json`
    './src/index.ts',
  ],
  resolve: {
    extensions: [
      '.scss',
      '.sass',
      '.css',
      '.tsx',
      '.ts',
      '.js',
      '.jpg',
      '.jpeg',
      '.png',
      '.svg',
      '.node',
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // @see https://github.com/TypeStrong/ts-loader
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        // More information here https://webpack.js.org/guides/asset-modules/
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: maxAssetSize, // 4kb
          },
        },
      },
    ],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.DEV': isDev,
    //   'process.env.DEBUG': isDebug,
    //   'process.env.APP_VERSION': JSON.stringify(projectInfo),
    // }),
  ],
  optimization: {
    minimize: minimizeAssets,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        // exclude: 'assets',
        terserOptions: {
          compress: {
            drop_debugger: false,
          },
        },
      }),
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: maxAssetSize,
  },
  output: {
    filename: scriptsAssetFile,
    // NOTE: See also `outDir` field in `tsconfig.json`
    path: path.resolve(__dirname, outPath),
    // @see https://webpack.js.org/configuration/output/#outputassetmodulefilename
    assetModuleFilename: `extracted/[name]-[hash][ext][query]`,
  },
  stats: {
    // Enable `@debug` and `@warn` messages from scss modules
    loggingDebug: ['sass-loader'],
  },
};

// @ts-check

const fs = require('fs');
const path = require('path');

const isDev = false; // getTruthy(process.env.DEV);
const isDebug = true; // getTruthy(process.env.DEBUG) || isDev;

/** Use locally served assets (only for debug mode) */
const useLocallyServedDevAssets = true;

const useInlineSourceMaps = !useLocallyServedDevAssets;

/** Create source maps for production mode (not dev) */
const generateSourcesForProduction = true;

const projectInfoFile = '../public/app-info.txt';
const projectInfo = fs
  .readFileSync(path.resolve(__dirname, projectInfoFile), { encoding: 'utf8' })
  .trim();
const outPath = 'dist';

const scriptsAssetFile = 'index.js';

// @see https://webpack.js.org/configuration/devtool/#devtool
const devtool = isDev
  ? useInlineSourceMaps
    ? 'inline-source-map'
    : 'source-map'
  : generateSourcesForProduction
    ? 'source-map'
    : undefined;
const minimizeAssets = !isDev || !useLocallyServedDevAssets;

// Info:
console.log('DEV:', isDev); // eslint-disable-line no-console
console.log('DEBUG:', isDebug); // eslint-disable-line no-console
console.log('VERSION:', projectInfo); // eslint-disable-line no-console
console.log('devtool:', devtool); // eslint-disable-line no-console
console.log('outPath:', outPath); // eslint-disable-line no-console

// Export parameters...
module.exports = {
  isDev,
  isDebug,
  projectInfo,
  outPath,
  devtool,
  minimizeAssets,
  scriptsAssetFile,
};

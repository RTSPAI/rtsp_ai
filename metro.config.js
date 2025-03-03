const { getDefaultConfig } = require('@expo/metro-config');
const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('tflite');
defaultConfig.resolver.sourceExts.push('cjs');
module.exports = defaultConfig;
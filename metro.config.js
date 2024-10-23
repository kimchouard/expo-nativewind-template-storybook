const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const { generate } = require("@storybook/react-native/scripts/generate");
const withStorybook = require('@storybook/react-native/metro/withStorybook');

generate({
  configPath: path.resolve(__dirname, "./.ondevice"),
});

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.transformer.unstable_allowRequireContext = true;

defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  const defaultResolveResult = context.resolveRequest(
    context,
    moduleName,
    platform
  );

  if (
    process.env.STORYBOOK_ENABLED !== "true" &&
    defaultResolveResult?.filePath?.includes?.(".ondevice/")
  ) {
    return {
      type: "empty",
    };
  }

  return defaultResolveResult;
};

const storybook = withStorybook(defaultConfig, {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: path.resolve(__dirname, './.ondevice'),
});

module.exports = withNativeWind(storybook, { input: './global.css' });

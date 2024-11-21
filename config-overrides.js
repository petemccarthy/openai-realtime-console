const path = require('path');

module.exports = function override(config, env) {
  // Add fallback for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    os: false
  };

  // Ignore critical dependency warnings from certain modules
  config.ignoreWarnings = [
    {
      module: /node_modules\/replicate/,
      message: /Critical dependency/,
    }
  ];

  // Configure sass-loader to use modern API
  const sassRule = config.module.rules.find(rule => rule.test?.toString().includes('scss|sass'));
  if (sassRule) {
    const sassLoader = sassRule.use.find(use => use.loader?.includes('sass-loader'));
    if (sassLoader) {
      sassLoader.options = {
        ...sassLoader.options,
        implementation: require('sass'),
        sassOptions: {
          ...sassLoader.options?.sassOptions,
          quietDeps: true // Suppress deprecation warnings
        }
      };
    }
  }

  return config;
}

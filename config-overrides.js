const { getLoader } = require("react-app-rewired");
const tsImportPluginFactory = require('ts-import-plugin')
const rewireCssModules = require('react-app-rewire-css-modules');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
  // Load Antd on demand
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
    rule.loader &&
    typeof rule.loader === 'string' &&
    rule.loader.includes('ts-loader')
  );

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [tsImportPluginFactory({
        libraryDirectory: 'es',
        libraryName: 'antd',
        style: true,
      })]
    })
  };

  // Customize Antd Theme
  config = rewireLess.withLoaderOptions({
    // modifyVars: { "@primary-color": "#1DA57A" },
  })(config, env);

  // CSS Modules
  config = rewireCssModules(config, env);

  return config;
}

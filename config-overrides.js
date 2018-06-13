const { getLoader } = require("react-app-rewired");
const tsImportPluginFactory = require('ts-import-plugin')
const rewireCssModules = require('react-app-rewire-css-modules');
const rewireLess = require('react-app-rewire-less');

const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || []

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result = undefined
    const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource)
    rules.some((rule, index) => result = ruleMatcher(rule) ? {index, rules} : findIndexAndRules(ruleChildren(rule), ruleMatcher))
    return result
}

const findRule = (rulesSource, ruleMatcher) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher)
    return rules[index]
}

const tsRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.(ts|tsx)$/);

module.exports = function override(config, env) {
  // Load Antd on demand
  const tsRule = findRule(config.module.rules, tsRuleMatcher)
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

  tsRule.exclude = /node_modules/

  // Customize Antd Theme
  config = rewireLess.withLoaderOptions({
    // modifyVars: { "@primary-color": "#1DA57A" },
  })(config, env);

  // CSS Modules
  config = rewireCssModules(config, env);

  return config;
}

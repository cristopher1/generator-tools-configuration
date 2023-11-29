class JSDocConfigurator {
  #addOverrides(eslintConfig) {
    eslintConfig.overrides.push({
      files: ['src/**/*.js'],
      extends: ['plugin:jsdoc/recommended'],
      plugins: ['jsdoc'],
      rules: {
        'jsdoc/tag-lines': 0,
      },
    })
  }

  addConfiguration(eslintConfig) {
    this.#addOverrides(eslintConfig)
  }

  addDependencies(packageJsonConfig) {
    packageJsonConfig.devDependencies['eslint-plugin-jsdoc'] = '^46.8.2'
  }

  removeDependencies(packageJsonConfig) {
    delete packageJsonConfig.devDependencies['eslint-plugin-jsdoc']
  }
}

export function createJSDocConfigurator() {
  return new JSDocConfigurator()
}

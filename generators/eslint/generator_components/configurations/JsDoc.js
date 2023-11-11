export class JsDoc {
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

  addDependencies(dependencies) {
    dependencies.devDependencies['eslint-plugin-jsdoc'] = '^46.8.2'
  }

  removeDependencies(dependencies) {
    delete dependencies.devDependencies['eslint-plugin-jsdoc']
  }
}

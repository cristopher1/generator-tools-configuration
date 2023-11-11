export class Prettier {
  #addExtends(eslintConfig) {
    eslintConfig.extends.push('prettier')
  }

  addConfiguration(eslintConfig) {
    this.#addExtends(eslintConfig)
  }

  addDependencies(dependencies) {
    dependencies.devDependencies['eslint-config-prettier'] = '^9.0.0'
  }

  removeDependencies(dependencies) {
    delete dependencies.devDependencies['eslint-config-prettier']
  }
}

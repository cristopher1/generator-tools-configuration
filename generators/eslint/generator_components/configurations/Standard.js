export class StandardJs {
  #addExtends(eslintConfig) {
    eslintConfig.extends.push('standard')
  }

  addConfiguration(eslintConfig) {
    this.#addExtends(eslintConfig)
  }

  addDependencies(dependencies) {
    dependencies.devDependencies['eslint-config-standard'] = '^17.1.0'
    dependencies.devDependencies['eslint-plugin-import'] = '^2.28.1'
    dependencies.devDependencies['eslint-plugin-n'] = '^16.0.2'
    dependencies.devDependencies['eslint-plugin-promise'] = '^6.1.1'
  }

  removeDependencies(dependencies) {
    delete dependencies.devDependencies['eslint-config-standard']
    delete dependencies.devDependencies['eslint-plugin-import']
    delete dependencies.devDependencies['eslint-plugin-n']
    delete dependencies.devDependencies['eslint-plugin-promise']
  }
}

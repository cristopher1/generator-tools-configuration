class PrettierConfigurator {
  #addExtends(eslintConfig) {
    eslintConfig.extends.push('prettier')
  }

  addConfiguration(eslintConfig) {
    this.#addExtends(eslintConfig)
  }

  addDependencies(packageJsonConfig) {
    packageJsonConfig.devDependencies['eslint-config-prettier'] = '^9.0.0'
  }

  removeDependencies(packageJsonConfig) {
    delete packageJsonConfig.devDependencies['eslint-config-prettier']
  }
}

export function createPrettierConfigurator() {
  return new PrettierConfigurator()
}

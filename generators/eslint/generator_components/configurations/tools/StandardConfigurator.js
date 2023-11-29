class StandardJSConfigurator {
  #addExtends(eslintConfig) {
    eslintConfig.extends.push('standard')
  }

  addConfiguration(eslintConfig) {
    this.#addExtends(eslintConfig)
  }

  addDependencies(packageJsonConfig) {
    packageJsonConfig.devDependencies['eslint-config-standard'] = '^17.1.0'
    packageJsonConfig.devDependencies['eslint-plugin-import'] = '^2.28.1'
    packageJsonConfig.devDependencies['eslint-plugin-n'] = '^16.0.2'
    packageJsonConfig.devDependencies['eslint-plugin-promise'] = '^6.1.1'
  }

  removeDependencies(packageJsonConfig) {
    delete packageJsonConfig.devDependencies['eslint-config-standard']
    delete packageJsonConfig.devDependencies['eslint-plugin-import']
    delete packageJsonConfig.devDependencies['eslint-plugin-n']
    delete packageJsonConfig.devDependencies['eslint-plugin-promise']
  }
}

export function createStandardJSConfigurator() {
  return new StandardJSConfigurator()
}

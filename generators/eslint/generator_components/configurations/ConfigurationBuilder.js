import { createEslintConfigurator } from './tools/EslintConfigurator.js'
import { createJestConfigurator } from './tools/JestConfigurator.js'
import { createJSDocConfigurator } from './tools/JSDocConfigurator.js'
import { createPrettierConfigurator } from './tools/PrettierConfigurator.js'
import { createStandardJSConfigurator } from './tools/StandardConfigurator.js'

export class ConfigurationBuilder {
  #fs
  #tools

  /**
   * @param {import('mem-fs-editor').MemFsEditor} fs The fs object included in
   *   Generator
   */
  constructor(fs) {
    const createToolConfig = (configurator) => ({
      install: false,
      configurator,
    })

    this.#fs = fs
    this.#tools = {
      jest: createToolConfig(createJestConfigurator()),
      jsdoc: createToolConfig(createJSDocConfigurator()),
      prettier: createToolConfig(createPrettierConfigurator()),
      standardJS: createToolConfig(createStandardJSConfigurator()),
    }
  }

  #obtainPackageJsonConfig() {
    const defaultPackageJsonConfig = {
      devDependencies: {},
    }
    const packageJsonConfig = this.#fs.readJSON('package.json')

    return packageJsonConfig ?? defaultPackageJsonConfig
  }

  includeJestConfig() {
    this.#tools.jest.install = true
  }

  includeJSDocConfig() {
    this.#tools.jsdoc.install = true
  }

  includePrettierConfig() {
    this.#tools.prettier.install = true
  }

  includeStandardJSConfig() {
    this.#tools.standardJS.install = true
  }

  build() {
    const eslintConfig = {}
    const packageJsonConfig = this.#obtainPackageJsonConfig()
    const eslintConfigurator = createEslintConfigurator()

    eslintConfigurator.addConfiguration(eslintConfig)
    eslintConfigurator.addDependencies(packageJsonConfig)
    eslintConfigurator.addScripts(packageJsonConfig)

    for (const tool of Object.values(this.#tools)) {
      const { install, configurator } = tool
      if (install) {
        configurator.addConfiguration(eslintConfig)
        configurator.addDependencies(packageJsonConfig)
      } else {
        configurator.removeDependencies(packageJsonConfig)
      }
    }

    return {
      getEslintConfig: () => eslintConfig,
      getPackageJsonConfig: () => packageJsonConfig,
    }
  }
}

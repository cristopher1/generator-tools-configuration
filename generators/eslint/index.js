import Generator from 'yeoman-generator'
import { createConfigurationBuilder } from './generator_components/configurations/index.js'
import { EslintJsonConfigWriter } from './generator_components/configWriters/EslintJsonConfigWriter.js'

export default class GeneratorEslint extends Generator {
  /** @type {import('./generator_components/configurations/ConfigurationBuilder.js').ConfigurationBuilder} */
  #configurationBuilder

  constructor(args, opts) {
    super(args, opts)

    this.option('jest', {
      default: false,
      description: 'Adds configuration to Jest',
    })
    this.option('jsdoc', {
      default: false,
      description: 'Adds configuration to JSDoc',
    })
    this.option('standard', {
      default: false,
      description: 'Adds configuration to JavaScript Standard Style',
    })
    this.option('prettier', {
      default: false,
      description: 'Adds configuration to Prettier',
    })
    this.option('save-to-packagejson', {
      default: false,
      description: 'Saves the eslint configuration into package.json',
    })
    this.option('skip-eslintignore', {
      default: 'false',
      description: 'Not generate a .eslintginore file',
    })
  }

  #saveOptions() {
    this.answers = {
      includeJest: this.options.jest,
      includeStandard: this.options.standard,
      includeJsDoc: this.options.jsdoc,
      includePrettier: this.options.prettier,
      saveToPackageJson: this.options['save-to-packagejson'],
      addScripts: this.options['add-scripts'],
      excludeEslintIgnore: this.options['skip-eslintignore'],
    }
  }

  initializing() {
    this.#saveOptions()
    this.#configurationBuilder = createConfigurationBuilder(this.fs)
  }

  configuring() {
    const { includeJest, includeStandard, includeJsDoc, includePrettier } =
      this.answers

    if (includeJest) {
      this.#configurationBuilder.includeJestConfig()
    }
    if (includeStandard) {
      this.#configurationBuilder.includeStandardJSConfig()
    }
    if (includeJsDoc) {
      this.#configurationBuilder.includeJSDocConfig()
    }
    if (includePrettier) {
      this.#configurationBuilder.includePrettierConfig()
    }

    const configuration = this.#configurationBuilder.build()

    this.eslintConfig = configuration.getEslintConfig()
    this.packageJsonConfig = configuration.getPackageJsonConfig()
  }

  #writePackageJson(eslintConfigWriter) {
    eslintConfigWriter.writeContent('package.json', this.packageJsonConfig)
  }

  #writeEslintConfigToPackageJson(eslintConfigWriter, eslintConfig) {
    const fileName = 'package.json'

    eslintConfigWriter.writeContent(fileName, { eslintConfig })
  }

  #writeEslintConfigToEslintrcJson(eslintConfigWriter, eslintConfig) {
    const fileName = '.eslintrc.json'

    eslintConfigWriter.writeContent(fileName, eslintConfig)
  }

  #createEslintConfig(writer) {
    const { saveToPackageJson } = this.answers
    const eslintConfig = this.eslintConfig

    if (saveToPackageJson) {
      this.#writeEslintConfigToPackageJson(writer, eslintConfig)
    } else {
      this.#writeEslintConfigToEslintrcJson(writer, eslintConfig)
    }

    this.#writePackageJson(writer)
  }

  writing() {
    const { excludeEslintIgnore } = this.answers
    const writer = new EslintJsonConfigWriter(this.fs)

    this.#createEslintConfig(writer)

    if (!excludeEslintIgnore) {
      this.fs.copy(
        this.templatePath('.eslintignore'),
        this.destinationPath('.eslintignore'),
      )
    }
  }
}

import Generator from 'yeoman-generator'
import { Jest } from './generator_components/configurations/Jest.js'
import { JsDoc } from './generator_components/configurations/JsDoc.js'
import { Prettier } from './generator_components/configurations/Prettier.js'
import { StandardJs } from './generator_components/configurations/Standard.js'
import { EslintJsonConfigWriter } from './generator_components/configWriters/EslintJsonConfigWriter.js'

export default class GeneratorESlint extends Generator {
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
      excludeEslintIgnore: this.options['skip-eslintignore'],
    }
  }

  #getDefaultEslintConfig() {
    return {
      env: {
        browser: true,
        es2021: true,
      },
      extends: ['eslint:recommended'],
      overrides: [
        {
          env: {
            node: true,
          },
          files: ['.eslintrc.{js,cjs}'],
          parserOptions: {
            sourceType: 'script',
          },
        },
      ],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    }
  }

  #addDefaultDependencies(packageJsonContent) {
    packageJsonContent.devDependencies = {
      eslint: '^8.47.0',
    }
  }

  #getPackageJsonContent() {
    const defaultPackageJsonContent = {}
    const packageJsonContent = this.fs.readJSON('package.json')

    return packageJsonContent ?? defaultPackageJsonContent
  }

  initializing() {
    this.#saveOptions()
    const eslintConfig = this.#getDefaultEslintConfig()
    const packageJsonContent = this.#getPackageJsonContent()

    this.#addDefaultDependencies(packageJsonContent)

    this.eslintConfig = eslintConfig
    this.packageJsonContent = packageJsonContent
  }

  #createConfig(config, isInclude) {
    return {
      isInclude,
      configurator: config,
    }
  }

  configuring() {
    const { includeJest, includeStandard, includeJsDoc, includePrettier } =
      this.answers
    const packageJsonContent = this.packageJsonContent
    const eslintConfig = this.eslintConfig
    const configurations = []

    const jest = this.#createConfig(new Jest(), includeJest)
    configurations.push(jest)

    const jsdoc = this.#createConfig(new JsDoc(), includeJsDoc)
    configurations.push(jsdoc)

    const prettier = this.#createConfig(new Prettier(), includePrettier)
    configurations.push(prettier)

    const standard = this.#createConfig(new StandardJs(), includeStandard)
    configurations.push(standard)

    for (const config of configurations) {
      if (config.isInclude) {
        config.configurator.addConfiguration(eslintConfig)
        config.configurator.addDependencies(packageJsonContent)
      } else {
        if (this.packageJsonContent.devDependencies) {
          config.configurator.removeDependencies(packageJsonContent)
        }
      }
    }
  }

  #writePackageJson(eslintConfigWriter) {
    eslintConfigWriter.writeContent('package.json', this.packageJsonContent)
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
        this.templatePath('./.eslintignore'),
        this.destinationPath('.eslintignore'),
      )
    }
  }
}

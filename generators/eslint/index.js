import Generator from 'yeoman-generator'
import { Jest } from './generator_components/configurations/Jest.js'
import { JsDoc } from './generator_components/configurations/JsDoc.js'
import { Prettier } from './generator_components/configurations/Prettier.js'
import { StandardJs } from './generator_components/configurations/Standard.js'
import { EslintJsonConfigWriter } from './generator_components/configWriters/EslintJsonConfigWriter.js'

export default class GeneratorESlint extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option('override', {
      default: false,
      description: 'Overrides the babel configuration',
    })
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
    this.option('skip-eslintignore', {
      default: 'false',
      description: 'Not generate a .eslintginore file',
    })
    this.option('skip-dependencies', {
      default: false,
      description: 'Does not add babel dependencies to package.json',
    })
  }

  #saveOptions() {
    this.answers = {
      override: this.options.override,
      includeJest: this.options.jest,
      includeStandard: this.options.standard,
      includeJsDoc: this.options.jsdoc,
      includePrettier: this.options.prettier,
      noEslintIgnore: this.options['skip-eslintignore'],
      noDependencies: this.options['skip-dependencies'],
    }
  }

  initializing() {
    this.#saveOptions()

    this.eslintConfig = {
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

    this.dependencies = {
      devDependencies: {
        eslint: '^8.47.0',
      },
    }
  }

  configuring() {
    const {
      includeJest,
      includeStandard,
      includeJsDoc,
      includePrettier,
      noDependencies,
    } = this.answers

    const configurations = []

    if (includeJest) {
      configurations.push(new Jest())
    }

    if (includeJsDoc) {
      configurations.push(new JsDoc())
    }

    if (includePrettier) {
      configurations.push(new Prettier())
    }
    if (includeStandard) {
      configurations.push(new StandardJs())
    }

    for (const config of configurations) {
      config.addConfiguration(this.eslintConfig)
      if (!noDependencies) {
        config.addDependencies(this.dependencies)
      }
    }
  }

  writing() {
    const { override } = this.options
    const writer = new EslintJsonConfigWriter(this.fs)

    if (override) {
      writer.overrideContent('.eslintrc.json', this.eslintConfig)
      writer.overrideContent('package.json', this.dependencies)
    } else {
      writer.addContent('.eslintrc.json', this.eslintConfig)
      writer.addContent('.eslintrc.json', this.dependencies)
    }
  }
}

import Generator from 'yeoman-generator'

export default class GeneratorBabel extends Generator {
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
    this.option('es5', {
      default: false,
      description: 'Adds configuration to transpile JavaScript code to es5',
    })
    this.option('es6', {
      default: false,
      description: 'Adds configuration to transpile JavaScript code to es6',
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
      includeEs6: this.options.es6,
      includeEs5: this.options.es5,
      skipDependencies: this.options['skip-dependencies'],
    }
  }

  initializing() {
    this.#saveOptions()
  }

  #addJestConfig(env) {
    env.test = {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
      ],
    }
  }

  #addEs5Config(env) {
    env.buildCommonJs = {
      comments: false,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            version: '^7.22.15',
          },
        ],
      ],
    }
  }

  #addEs6Config(env) {
    env.buildEsModules = {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              esmodules: true,
            },
            modules: false,
          },
        ],
      ],
      comments: false,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            corejs: 3,
            version: '^7.22.15',
          },
        ],
      ],
    }
  }

  configuring() {
    const { includeJest, includeEs5, includeEs6 } = this.answers

    const babelConfig = {
      presets: ['@babel/preset-env'],
    }

    const env = {}

    if (includeJest) {
      this.#addJestConfig(env)
    }

    if (includeEs5) {
      this.#addEs5Config(env)
    }

    if (includeEs6) {
      this.#addEs6Config(env)
    }

    babelConfig.env = env

    this.babelConfig = babelConfig
  }

  #addBaseDependencies(writer) {
    writer.write('package.json', {
      devDependencies: {
        '@babel/cli': '^7.22.10',
        '@babel/core': '^7.22.10',
        '@babel/preset-env': '^7.22.10',
      },
    })
  }

  #addDependenciesToTranspileEs5OrEs6(writer) {
    writer.write('package.json', {
      dependencies: {
        '@babel/runtime-corejs3': '^7.22.11',
        'core-js': '^3.32.1',
      },
      devDependencies: {
        '@babel/plugin-transform-runtime': '^7.22.10',
      },
    })
  }

  #createBabelConfigJsonFile(writer, fileName, babelConfig) {
    const { includeEs5, includeEs6, skipDependencies } = this.answers

    writer.write(fileName, babelConfig)
    if (!skipDependencies) {
      this.#addBaseDependencies(writer)
      if (includeEs5 || includeEs6) {
        this.#addDependenciesToTranspileEs5OrEs6(writer)
      }
    }
  }

  writing() {
    const { override } = this.options

    if (override) {
      const writer = {
        write: (fileName, object) => {
          this.fs.writeJSON(fileName, object)
        },
      }

      writer.fs = this.fs

      this.#createBabelConfigJsonFile(
        writer,
        'babel.config.json',
        this.babelConfig,
      )
    } else {
      const writer = {
        write: function (fileName, object) {
          this.fs.extendJSON(fileName, object)
        },
      }

      writer.fs = this.fs

      this.#createBabelConfigJsonFile(
        writer,
        'babel.config.json',
        this.babelConfig,
      )
    }
  }
}

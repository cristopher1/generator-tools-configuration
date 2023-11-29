class EslintConfigurator {
  #addEnv(eslintConfig) {
    eslintConfig.env = {
      browser: true,
      es2021: true,
    }
  }

  #addExtends(eslintConfig) {
    eslintConfig.extends = ['eslint:recommended']
  }

  #addOverrides(eslintConfig) {
    eslintConfig.overrides = [
      {
        env: {
          node: true,
        },
        files: ['.eslintrc.{js,cjs}'],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ]
  }

  #addParseOptions(eslintConfig) {
    eslintConfig.parserOptions = {
      ecmaVersion: 'latest',
      sourceType: 'module',
    }
  }

  addConfiguration(eslintConfig) {
    this.#addEnv(eslintConfig)
    this.#addExtends(eslintConfig)
    this.#addOverrides(eslintConfig)
    this.#addParseOptions(eslintConfig)
  }

  addDependencies(packageJsonConfig) {
    packageJsonConfig.devDependencies.eslint = '^8.47.0'
  }

  addScripts(packageJsonConfig) {
    packageJsonConfig.scripts = {
      lint: 'eslint --ext .js,.mjs,.cjs .',
      'lint:fix': 'npm run lint -- --fix',
    }
  }
}

export function createEslintConfigurator() {
  return new EslintConfigurator()
}

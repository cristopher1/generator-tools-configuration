export class Jest {
  #addOverrides(eslintConfig) {
    eslintConfig.overrides.push({
      env: {
        node: true,
      },
      files: ['__tests__/**/*.js'],
      extends: ['plugin:jest/recommended'],
      plugins: ['jest'],
    })
  }

  addConfiguration(eslintConfig) {
    this.#addOverrides(eslintConfig)
  }

  addDependencies(dependencies) {
    dependencies.devDependencies['eslint-plugin-jest'] = '^27.2.3'
  }
}

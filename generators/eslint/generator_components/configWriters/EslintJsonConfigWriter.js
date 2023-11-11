export class EslintJsonConfigWriter {
  #writer

  constructor(writer) {
    this.#writer = writer
  }

  addContent(fileName, content) {
    this.#writer.extendJSON(fileName, content)
  }

  overrideContent(fileName, content) {
    this.#writer.writeJSON(fileName, content)
  }
}

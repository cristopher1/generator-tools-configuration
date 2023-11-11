export class EslintJsonConfigWriter {
  #writer

  constructor(writer) {
    this.#writer = writer
  }

  writeContent(fileName, content) {
    this.#writer.writeJSON(fileName, content)
  }
}

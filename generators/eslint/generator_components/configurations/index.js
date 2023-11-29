import { ConfigurationBuilder } from './ConfigurationBuilder.js'

/**
 * @param {import('mem-fs-editor').MemFsEditor} fs The fs object included in
 *   Generator
 */
export function createConfigurationBuilder(fs) {
  return new ConfigurationBuilder(fs)
}

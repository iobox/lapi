import Extension from './extension'

export default class ExtensionManager {
  constructor() {
    /**
     * Available extensions
     * @type {Array}
     * @private
     */
    this._extensions = []  
  }
  
  /**
   * Return all extensions
   * @returns {Extension[]}
   */
  getExtensions() {
    return this._extensions
  }

  /**
   * Set and replace all extensions
   * @param {Extension[]} extensions
   * @throws {Error} throw an Error if extensions is not an Array
   */
  setExtensions(extensions) {
    if (Array.isArray(extensions)) {
      this._extensions = extensions
    } else {
      throw new Error('[Foundation/Extension/Manager#setExtensions] extensions must be an Array')
    }
  }

  /**
   * Extend QueryManager with an extension
   * @param {Extension} extension
   * @throws {Error} throw an Error if extension is not an instance of Extension
   */
  extend(extension) {
    if (extension instanceof Extension) {
      this._extensions.push(extension)
    } else {
      throw new Error('[Foundation/Extension/Manager#extend] extension must be an instance of Foundation/Extension/Interface')
    }
  }
}
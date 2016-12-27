import ExtensionInterface from './interface'

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
   * @returns {ExtensionInterface[]}
   */
  getExtensions() {
    return this._extensions
  }

  /**
   * Set and replace all extensions
   * @param {ExtensionInterface[]} extensions
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
   * @param {ExtensionInterface} extension
   * @throws {Error} throw an Error if extension is not an instance of ExtensionInterface
   */
  extend(extension) {
    if (extension instanceof ExtensionInterface) {
      this._extensions.push(extension)
    } else {
      throw new Error('[Foundation/Extension/Manager#extend] extension must be an instance of Foundation/Extension/Interface')
    }
  }
}
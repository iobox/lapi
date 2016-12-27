import Kernel from './kernel'

export default class Extension extends Kernel {
  /**
   * Get name
   * @returns {string}
   */
  getName() {
    return this._name
  }

  /**
   * Set name
   * @param {string} name
   */
  setName(name) {
    this._name = name
  }
}
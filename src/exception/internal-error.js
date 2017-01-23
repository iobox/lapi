import Exception from './../exception'
import Bag from '../foundation/bag'

export default class InternalErrorException extends Exception {
  constructor(message = '', code = null, args = null) {
    super(message, code)
    this.setArguments(args || new Bag())
  }

  /**
   * Get Exception's arguments
   * @returns {Bag}
   */
  getArguments() {
    return this._arguments
  }

  /**
   * Set Exception's arguments
   * @param {Object|Bag} args
   */
  setArguments(args) {
    if (args instanceof Bag) {
      this._arguments = args
    } else if (typeof args === 'object') {
      this._arguments = new Bag(args)
    }
  }

  /**
   * Check if key exist
   * @param {!string} key
   * @returns {boolean}
   */
  has(key) {
    return this.getArguments().has(key)
  }

  /**
   * Get argument by key
   * @param {!string} key
   * @param {?*} [def=null]
   * @returns {*}
   */
  get(key, def = null) {
    return this.getArguments().get(key, def)
  }
}
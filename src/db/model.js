import NotImplementedException from '../exception/not-implemented'
import Bag from '../foundation/bag'
import Repository from './repository'
import Schema from './schema'
export default class Model extends Bag {
  /**
   * Return identity of Model
   * @abstract
   * @returns {string|number}
   */
  getId() {
    throw new NotImplementedException()
  }

  /**
   * Table or collection's name
   * @abstract
   * @returns {string}
   */
  static getName() {
    throw new NotImplementedException()
  }

  /**
   * Get repository
   * @abstract
   * @returns {Repository}
   */
  static getRepository() {
    throw new NotImplementedException()
  }

  /**
   * Get schema
   * @abstract
   * @returns {Schema}
   */
  static getSchema() {
    throw new NotImplementedException()
  }

  /**
   * Get value by key
   * @param {!string} key
   * @param {?*} def
   * @returns {?*}
   */
  get(key, def = null) {
    return this.has(key) ? this.constructor.getSchema().getValue(key, this) : def
  }

  /**
   * Save model
   * @returns {Promise}
   */
  save() {
    this.constructor.getRepository().update(this.all(), this.constructor.getSchema().getIdentity(this))
  }

  /**
   * Remove current model from database
   * @returns {Promise}
   */
  destroy() {
    this.constructor.getRepository().delete(this.constructor.getSchema().getIdentity(this))
  }
}
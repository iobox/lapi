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
   * Save model
   * @returns {Promise}
   */
  save() {
    this.constructor.getRepository().update(this.all(), this.constructor.getSchema().getKey(this))
  }

  /**
   * Remove current model from database
   * @returns {Promise}
   */
  destroy() {
  }
}
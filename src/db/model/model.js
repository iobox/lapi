import NotImplementedException from '../../exception/not-implemented'
import Bag from '../../foundation/bag'
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
   * Save model
   * @abstract
   * @returns {Promise}
   */
  save() {
    throw new NotImplementedException()
  }

  /**
   * Remove current model from database
   * @abstract
   * @returns {Promise}
   */
  destroy() {
    throw new NotImplementedException()
  }
}
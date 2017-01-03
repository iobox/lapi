import NotImplementedException from '../../exception/not-implemented'
/**
 * @interface
 */
export default class ModelInterface {
  /**
   * Return identity of Model
   * @returns {string|number}
   */
  getId() {
    throw new NotImplementedException()
  }

  /**
   * Set value of model's property by key
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    throw new NotImplementedException()
  }

  /**
   * Get model's property
   * @param {string} key
   * @param {*} [def=null]
   */
  get(key, def = null) {
    throw new NotImplementedException()
  }

  /**
   * Return key-value pairs
   * @param {Array} keys if this argument is null, it would return all keys
   * @returns {Object}
   */
  toJSON(keys = null) {
    throw new NotImplementedException()
  }

  /**
   * Save model
   * @returns {Promise}
   */
  save() {
    throw new NotImplementedException()
  }

  /**
   * Remove current model from database
   * @returns {Promise}
   */
  destroy() {
    throw new NotImplementedException()
  }
}
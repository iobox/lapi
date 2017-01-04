import NotImplementedException from '../../exception/not-implemented'
export default class Repository {
  /**
   * Find records by condition
   * @abstract
   * @param {Object} condition
   * @returns {Promise}
   */
  find(condition) {
    throw new NotImplementedException()
  }

  /**
   * Find record by Id
   * @abstract
   * @param {string|number} id
   * @returns {Promise}
   */
  findId(id) {
    throw new NotImplementedException()
  }

  /**
   * Find one record
   * @abstract
   * @param {Object} condition
   * @returns {Promise}
   */
  findOne(condition) {
    throw new NotImplementedException()
  }

  /**
   * Insert and return a model
   * @abstract
   * @param {Object} model
   * @returns {Promise}
   */
  insert(model) {
    throw new NotImplementedException()
  }

  /**
   * Update records
   * @abstract
   * @param {Object} data
   * @param {Object} condition
   * @returns {Promise}
   */
  update(data, condition) {
    throw new NotImplementedException()
  }

  /**
   * Delete records
   * @abstract
   * @param {Object} condition
   * @returns {Promise}
   */
  delete(condition) {
    throw new NotImplementedException()
  }
}

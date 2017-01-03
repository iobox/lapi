import NotImplementedException from '../../exception/not-implemented'
/**
 * @interface
 */
export default class RepositoryInterface {
  /**
   * Find records by condition
   * @param {Object} condition
   * @returns {Promise}
   */
  find(condition) {
    throw new NotImplementedException()
  }

  /**
   * Find record by Id
   * @param {string|number} id
   * @returns {Promise}
   */
  findId(id) {
    throw new NotImplementedException()
  }

  /**
   * Find one record
   * @param {Object} condition
   * @returns {Promise}
   */
  findOne(condition) {
    throw new NotImplementedException()
  }

  /**
   * Insert and return a model
   * @param {Object} model
   * @returns {Promise}
   */
  insert(model) {
    throw new NotImplementedException()
  }

  /**
   * Update records
   * @param {Object} data
   * @param {Object} condition
   * @returns {Promise}
   */
  update(data, condition) {
    throw new NotImplementedException()
  }

  /**
   * Delete records
   * @param {Object} condition
   * @returns {Promise}
   */
  delete(condition) {
    throw new NotImplementedException()
  }
}

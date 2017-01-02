import NotImplementedException from '../../exception/not-implemented'
import ModelInterface from '../model/interface'

export default class RepositoryInterface {
  /**
   * Find records by condition
   * @param {Object} condition
   * @returns {ModelInterface[]}
   */
  find(condition) {
    throw new NotImplementedException()
  }

  /**
   * Find one record
   * @param {Object} condition
   * @returns {ModelInterface}
   */
  findOne(condition) {
    throw new NotImplementedException()
  }

  /**
   * Create and return a model
   * @param {Object} model
   * @returns {ModelInterface}
   */
  create(model) {
    throw new NotImplementedException()
  }

  /**
   * Update records
   * @param {Object} data
   * @param {Object} condition
   */
  update(data, condition) {
    throw new NotImplementedException()
  }

  /**
   * Delete records
   * @param {Object} condition
   */
  delete(condition) {
    throw new NotImplementedException()
  }
}

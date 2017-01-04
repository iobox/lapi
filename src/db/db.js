import NotImplementedException from '../exception/not-implemented'
export default class Db {
  constructor() {
    this._db = null
  }

  /**
   * Get connection
   * @returns {*}
   */
  getConnection() {
    return this._db
  }

  /**
   * Set connection
   * @param {*} db
   */
  setConnection(db) {
    this._db = db
  }

  /**
   * Find record(s)
   * @param {string} collection
   * @param {Object} condition
   * @param {Object} [options=null]
   */
  find(collection, condition, options = null) {
    throw new NotImplementedException('[Db/db#find] this method must be implemented')
  }

  /**
   * Find one record
   * @param {string} collection
   * @param {Object} condition
   * @param {Object} [options=null]
   */
  findOne(collection, condition, options = null) {
    throw new NotImplementedException('[Db/db#findOne] this method must be implemented')
  }

  /**
   * Insert record(s)
   * @param {string} collection
   * @param {Array|Object} data if data is an array, it would be multiple insertion
   * @param {Object} [options=null]
   */
  insert(collection, data, options = null) {
    throw new NotImplementedException('[Db/db#insert] this method must be implemented')
  }

  /**
   * Update record(s)
   * @param {string} collection
   * @param {Object} condition Condition to update
   * @param {Object} data Only contains new changes
   * @param {Object} [options=null] Additional configuration for updating
   */
  update(collection, condition, data, options = null) {
    throw new NotImplementedException('[Db/db#update] this method must be implemented')
  }

  /**
   * Delete record(s)
   * @param {string} collection
   * @param {Object} condition
   * @param {Object} [options=null]
   */
  delete(collection, condition, options = null) {
    throw new NotImplementedException('[Db/db#delete] this method must be implemented')
  }
}
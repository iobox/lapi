import NotImplementedException from '../exception/not-implemented'
import InvalidArgumentException from '../exception/invalid-argument'
import NotFoundException from '../exception/not-found'
import Db from './db'
import Model from './model'
import ContainerAware from '../di/container-aware'
export default class Repository extends ContainerAware {
  /**
   * Get Model
   * @returns {Model}
   */
  static getModel() {
    throw new NotImplementedException()
  }

  /**
   * Get Db
   * @returns {Db}
   * @throws {NotFoundException} throws an exception when there is none of instance of Db is registered in container
   * @throws {InvalidArgumentException} throws an exception if internal db instance is not an instance of Db
   */
  getDb() {
    if (!this.getContainer().has('db')) {
      throw new NotFoundException('[Db/Repository#getDb] db is not registered in DI/Container')
    }
    const db = this.getContainer().get('db')
    if (!(db instanceof Db)) {
      throw new InvalidArgumentException('[Db/Repository#getDb] db is null or not an instance of Db/Db')
    }
    return db
  }
  
  /**
   * Find records by condition
   * @param {Object} condition
   * @returns {Promise}
   */
  find(condition) {
    return this.getDb().find(this.constructor.getModel().getName(), condition)
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
   * @param {Object} model
   * @param {?Object} [options=null]
   * @returns {Promise}
   */
  insert(model, options = null) {
    return this.getDb().insert(this.constructor.getModel().getName(), model.all(), options)
  }

  /**
   * Update records
   * @abstract
   * @param {Object} data
   * @param {Object} condition
   * @param {?Object} [options=null]
   * @returns {Promise}
   */
  update(data, condition, options = null) {
    return this.getDb().update(this.constructor.getModel().getName(), data, condition, options)
  }

  /**
   * Delete records
   * @abstract
   * @param {Object} condition
   * @param {?Object} [options=null]
   * @returns {Promise}
   */
  delete(condition, options = null) {
    return this.getDb().delete(this.constructor.getModel().getName(), condition, options)
  }
}
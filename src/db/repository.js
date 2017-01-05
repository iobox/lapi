import NotImplementedException from '../exception/not-implemented'
import InvalidArgumentException from '../exception/invalid-argument'
import NotFoundException from '../exception/not-found'
import Db from './db'
import Model from './model'
import ContainerAware from '../foundation/container/container-aware'
export default class Repository extends ContainerAware {
  constructor(container = null) {
    super()
    this._model = null
  }

  /**
   * Get Db
   * @returns {Db}
   * @throws {NotFoundException} throws an exception when there is none of instance of Db is registered in container
   * @throws {InvalidArgumentException} throws an exception if internal db instance is not an instance of Db
   */
  getDb() {
    if (!this.getContainer().has('db')) {
      throw new NotFoundException('[Db/Repository#getDb] db is not registered in Container')
    }
    const db = this.getContainer().get('db')
    if (!(db instanceof Db)) {
      throw new InvalidArgumentException('[Db/Repository#getDb] db is null or not an instance of Db')
    }
    return this._db
  }

  /**
   * Get Model
   * @returns {Model}
   */
  getModel() {
    return this._model
  }

  /**
   * Set Model
   * @param {Model} model
   * @throws {InvalidArgumentException} throws an exception if model is not an instance of Model
   */
  setModel(model) {
    if (model instanceof Model) {
      this._model = model
    } else {
      throw new InvalidArgumentException('[Db/Repository#setModel] model must be an instance of Model')
    }
  }
  
  /**
   * Find records by condition
   * @param {Object} condition
   * @returns {Promise}
   */
  find(condition) {
    return this.getDb().find(this.getModel().getName(), condition)
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
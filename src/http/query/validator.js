import Bag from '../../bag'
import Request from '../request'
import ExtensionManager from '../../foundation/extension/manager'
import QueryExtensionInterface from './extension/interface'

export default class Validator {
  /**
   * Constructor
   * @param {Request} request
   * @param {Bag|Object} rules
   */
  constructor(request, rules) {
    this.setRequest(request || new Request())
    this.setRules(rules || new Bag())

    /**
     * A result of execution
     * @type {Bag}
     * @private
     */
    this._parameters = new Bag()

    /**
     * Internal Extension Manager
     * @type {ExtensionManager}
     * @private
     */
    this._extensionManager = new ExtensionManager()
  }

  /**
   * Get Request
   * @returns {Request}
   */
  getRequest() {
    return this._request
  }

  /**
   * Set Request
   * @param {Request} request
   */
  setRequest(request) {
    if (!(request instanceof Request)) {
      throw new Error('[QueryManager#setRequest] request must be an instance of Request')
    }
    this._request = request
  }

  /**
   * Get all rules
   * @returns {Bag}
   */
  getRules() {
    return this._rules
  }

  /**
   * Set rules
   * @param {Bag|Object} rules
   * @throws {Error} throw an Error if rules is not an instance of Bag or an object
   */
  setRules(rules) {
    if (rules instanceof Bag) {
      this._rules = rules
    } else if (typeof rules === 'object') {
      this._rules = new Bag(rules)
    } else {
      throw new Error('[QueryManager#setRules] rules must be an instance of Bag or an object')
    }
  }

  /**
   * Get Extension Manager
   * @returns {ExtensionManager}
   */
  getExtensionManager() {
    return this._extensionManager
  }

  /**
   * Set Extension Manager
   * @param {!ExtensionManager} extensionManager
   */
  setExtensionManager(extensionManager) {
    this._extensionManager = extensionManager
  }

  /**
   * Add a rule
   * If there was already at least one rule, it would be merged
   *
   * @param {!string} field
   * @param {!Object} rule
   */
  set(field, rule) {
    if (this.getRules().has(field)) {
      this.getRules().set(field, Object.assign(this.getRules().get(field), rule))
    } else {
      this.getRules().set(field, rule)
    }
  }

  /**
   * Remove a rule
   * @param {!string} field
   * @param {?Object} [rule=null] Only remove specific rule. All rules belong to appropriate name will be removed if this field is null
   * @private
   */
  delete(field, rule = null) {
    if (this.getRules().has(field)) {
      if (rule === null) {
        this.getRules().delete(field)
      } else {
        let item = this.getRules().get(field)
        delete item[rule]
        this.getRules().set(field, item)
      }
    }
  }

  /**
   * Execute all rules to produce parameters
   */
  execute() {
    const query = this.getRequest().getQuery();
    this.getRules().forEach((field, rules) => {
      Object.keys(rules).forEach(function(key) { /* Loop rules */
        for (const extension of this.getExtensionManager().getExtensions()) { /* Loop extensions */
          if (extension instanceof QueryExtensionInterface) { /* Only process if extension is an instance of QueryExtensionInterface */
            // Check whether or not appropriate key is registered, and it must be a name of extension's method
            if (extension.register().indexOf(key) >= 0 && typeof extension[key] === 'function') {
              extension[key](query, field, rule[key])

              // The value is accepted, since there is no errors raised
              this._parameters.set(field, query.get(field))
            }
          }
        }
      })
    })
  }

  /**
   * Get all parameters
   * @returns {Object}
   */
  all() {
    return this._parameters.all()
  }

  /**
   * Only return some of parameters
   * @param {!Array} fields
   * @returns {Object}
   */
  only(fields) {
    return this._parameters.only(fields)
  }

  /**
   * Get a specific parameter
   * @param {!string} field
   * @param {?*} [def=null] Default value to be returned
   */
  get(field, def = null) {
    return this._parameters.get(field, def)
  }
}
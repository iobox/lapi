import Bag from '../../foundation/bag'
import Request from '../request'
import ExtensionManager from '../../foundation/extension/manager'
import QueryExtensionInterface from './extension/extension'
import InvalidArgumentException from '../../exception/invalid-argument'

export default class Validator {
  /**
   * Constructor
   * @param {?Request} [request=null]
   * @param {?(Bag|Object)} [rules=null]
   */
  constructor(request = null, rules = null) {
    this.setRequest(request || new Request())
    this.setRules(rules || new Bag())

    /**
     * A result of execution
     * @type {Bag}
     * @private
     */
    this._attributes = new Bag()

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
   * @throws {InvalidArgumentException} throws an InvalidArgumentException if request is not an instance of Request
   */
  setRequest(request) {
    if (!(request instanceof Request)) {
      throw new InvalidArgumentException('[Http/Query/Validator#setRequest] request must be an instance of Request')
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
   * @throws {InvalidArgumentException} throw an Error if rules is not an instance of Bag or an object
   */
  setRules(rules) {
    if (rules instanceof Bag) {
      this._rules = rules
    } else if (typeof rules === 'object') {
      this._rules = new Bag(rules)
    } else {
      throw new InvalidArgumentException('[Http/Query/Validator#setRules] rules must be an instance of Bag or an object')
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
   * @returns {Validator}
   */
  execute() {
    const self  = this
    const query = this.getRequest().getQuery()
    this._attributes = new Bag()
    this.getRules().forEach((field, rules) => {
      const methods = Object.keys(rules)
      if (!methods.length) {
        // If there is no methods specified, just add value to attributes
        self._attributes.set(field, query.get(field))
        return true
      }

      let def = null
      methods.forEach(function (method) { /* Loop through rules */
        if (method === 'def') {
          // Special case! Reserved key uses to return default value
          def = rules[method]
          return true
        }

        for (const extension of self.getExtensionManager().getExtensions()) { /* Loop through extensions */
          if (extension instanceof QueryExtensionInterface) { /* Only process if extension is an instance of QueryExtensionInterface */
            // Check whether or not appropriate key is registered, and it must be a name of extension's method
            if (extension.register().indexOf(method) >= 0 && typeof extension[method] === 'function') {
              // Run extension rule validation
              extension[method](query, field, rules[method])
            }
          }
        }
      })

      // The value is accepted, since there is no errors raised
      self._attributes.set(field, query.get(field, def))
    })

    return this
  }

  /**
   * Get all parameters
   * @returns {Object}
   */
  all() {
    return this._attributes.all()
  }

  /**
   * Only return some of parameters
   * @param {!Array} fields
   * @returns {Object}
   */
  only(fields) {
    return this._attributes.only(fields)
  }

  /**
   * Get a specific parameter
   * @param {!string} field
   * @param {?*} [def=null] Default value to be returned
   */
  get(field, def = null) {
    return this._attributes.get(field, def)
  }
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('../../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _request = require('../request');

var _request2 = _interopRequireDefault(_request);

var _manager = require('../../foundation/extension/manager');

var _manager2 = _interopRequireDefault(_manager);

var _interface = require('./extension/interface');

var _interface2 = _interopRequireDefault(_interface);

var _invalidArgument = require('../../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validator = function () {
  /**
   * Constructor
   * @param {?Request} [request=null]
   * @param {?(Bag|Object)} [rules=null]
   */
  function Validator() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Validator);

    this.setRequest(request || new _request2.default());
    this.setRules(rules || new _bag2.default());

    /**
     * A result of execution
     * @type {Bag}
     * @private
     */
    this._attributes = new _bag2.default();

    /**
     * Internal Extension Manager
     * @type {ExtensionManager}
     * @private
     */
    this._extensionManager = new _manager2.default();
  }

  /**
   * Get Request
   * @returns {Request}
   */


  _createClass(Validator, [{
    key: 'getRequest',
    value: function getRequest() {
      return this._request;
    }

    /**
     * Set Request
     * @param {Request} request
     * @throws {InvalidArgumentException} throws an InvalidArgumentException if request is not an instance of Request
     */

  }, {
    key: 'setRequest',
    value: function setRequest(request) {
      if (!(request instanceof _request2.default)) {
        throw new _invalidArgument2.default('[Http/Query/Validator#setRequest] request must be an instance of Request');
      }
      this._request = request;
    }

    /**
     * Get all rules
     * @returns {Bag}
     */

  }, {
    key: 'getRules',
    value: function getRules() {
      return this._rules;
    }

    /**
     * Set rules
     * @param {Bag|Object} rules
     * @throws {InvalidArgumentException} throw an Error if rules is not an instance of Bag or an object
     */

  }, {
    key: 'setRules',
    value: function setRules(rules) {
      if (rules instanceof _bag2.default) {
        this._rules = rules;
      } else if ((typeof rules === 'undefined' ? 'undefined' : _typeof(rules)) === 'object') {
        this._rules = new _bag2.default(rules);
      } else {
        throw new _invalidArgument2.default('[Http/Query/Validator#setRules] rules must be an instance of Bag or an object');
      }
    }

    /**
     * Get Extension Manager
     * @returns {ExtensionManager}
     */

  }, {
    key: 'getExtensionManager',
    value: function getExtensionManager() {
      return this._extensionManager;
    }

    /**
     * Set Extension Manager
     * @param {!ExtensionManager} extensionManager
     */

  }, {
    key: 'setExtensionManager',
    value: function setExtensionManager(extensionManager) {
      this._extensionManager = extensionManager;
    }

    /**
     * Add a rule
     * If there was already at least one rule, it would be merged
     *
     * @param {!string} field
     * @param {!Object} rule
     */

  }, {
    key: 'set',
    value: function set(field, rule) {
      if (this.getRules().has(field)) {
        this.getRules().set(field, Object.assign(this.getRules().get(field), rule));
      } else {
        this.getRules().set(field, rule);
      }
    }

    /**
     * Remove a rule
     * @param {!string} field
     * @param {?Object} [rule=null] Only remove specific rule. All rules belong to appropriate name will be removed if this field is null
     * @private
     */

  }, {
    key: 'delete',
    value: function _delete(field) {
      var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.getRules().has(field)) {
        if (rule === null) {
          this.getRules().delete(field);
        } else {
          var item = this.getRules().get(field);
          delete item[rule];
          this.getRules().set(field, item);
        }
      }
    }

    /**
     * Execute all rules to produce parameters
     * @returns {Validator}
     */

  }, {
    key: 'execute',
    value: function execute() {
      var self = this;
      var query = this.getRequest().getQuery();
      this._attributes = new _bag2.default();
      this.getRules().forEach(function (field, rules) {
        var methods = Object.keys(rules);
        if (!methods.length) {
          // If there is no methods specified, just add value to attributes
          self._attributes.set(field, query.get(field));
          return true;
        }

        var def = null;
        methods.forEach(function (method) {
          /* Loop through rules */
          if (method === 'def') {
            // Special case! Reserved key uses to return default value
            def = rules[method];
            return true;
          }

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = self.getExtensionManager().getExtensions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var extension = _step.value;
              /* Loop through extensions */
              if (extension instanceof _interface2.default) {
                /* Only process if extension is an instance of QueryExtensionInterface */
                // Check whether or not appropriate key is registered, and it must be a name of extension's method
                if (extension.register().indexOf(method) >= 0 && typeof extension[method] === 'function') {
                  // Run extension rule validation
                  extension[method](query, field, rules[method]);
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });

        // The value is accepted, since there is no errors raised
        self._attributes.set(field, query.get(field, def));
      });

      return this;
    }

    /**
     * Get all parameters
     * @returns {Object}
     */

  }, {
    key: 'all',
    value: function all() {
      return this._attributes.all();
    }

    /**
     * Only return some of parameters
     * @param {!Array} fields
     * @returns {Object}
     */

  }, {
    key: 'only',
    value: function only(fields) {
      return this._attributes.only(fields);
    }

    /**
     * Get a specific parameter
     * @param {!string} field
     * @param {?*} [def=null] Default value to be returned
     */

  }, {
    key: 'get',
    value: function get(field) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this._attributes.get(field, def);
    }
  }]);

  return Validator;
}();

exports.default = Validator;
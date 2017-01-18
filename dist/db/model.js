'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _repository = require('./repository');

var _repository2 = _interopRequireDefault(_repository);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _notImplemented = require('../exception/not-implemented');

var _notImplemented2 = _interopRequireDefault(_notImplemented);

var _notFound = require('../exception/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Model = function (_Bag) {
  _inherits(Model, _Bag);

  function Model() {
    _classCallCheck(this, Model);

    return _possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).apply(this, arguments));
  }

  _createClass(Model, [{
    key: 'getId',

    /**
     * Return identity of Model
     * @abstract
     * @returns {string|number}
     */
    value: function getId() {
      throw new _notImplemented2.default('[Db/Model#getId] method getId must be implemented');
    }

    /**
     * Table or collection's name
     * @abstract
     * @returns {string}
     */

  }, {
    key: 'getIdentity',


    /**
     * Get identity's condition
     * @returns {Object}
     */
    value: function getIdentity() {
      var _this2 = this;

      var identity = {};
      this.constructor.getSchema().forEach(function (field, options) {
        if (options.has(_schema2.default.KEY) && options.get(_schema2.default.KEY) === true) {
          identity[field] = _this2.get(field);
        }
      });
      return identity;
    }

    /**
     * Get value by key
     * @param {!string} field
     * @param {?*} def
     * @returns {?*}
     */

  }, {
    key: 'get',
    value: function get(field) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!this.has(field)) {
        return def;
      }

      var schema = this.constructor.getSchema();
      if (!schema.has(field)) {
        return def;
      }

      var options = schema.get(field);
      var value = _get(Model.prototype.__proto__ || Object.getPrototypeOf(Model.prototype), 'get', this).call(this, field);
      if (options.has(_schema2.default.FUNC_GET)) {
        value = options.get(_schema2.default.FUNC_GET)(value);
      }

      return value;
    }

    /**
     * Set value of field
     * @param {!string} field
     * @param {?*} value
     */

  }, {
    key: 'set',
    value: function set(field, value) {
      var schema = this.constructor.getSchema();
      if (schema.has(field)) {
        var options = schema.get(field);
        if (options.has(_schema2.default.FUNC_SET)) {
          value = options.get(_schema2.default.FUNC_SET)(value);
        } else if (options.has(_schema2.default.TYPE)) {
          switch (options.get(_schema2.default.TYPE)) {
            case _schema2.default.TYPE_INT:
              value = parseInt(value);
              break;
            case _schema2.default.TYPE_FLOAT:
              value = parseFloat(value);
              break;
            case _schema2.default.TYPE_BUFFER:
              break;
            case _schema2.default.TYPE_ARRAY:
            case Array:
              if (!Array.isArray(value)) {
                value = [value];
              }
              break;
            case _schema2.default.TYPE_DATE:
            case _schema2.default.TYPE_DATETIME:
              if (!(value instanceof Date)) {
                value = new Date(value);
              }
              break;
            case _schema2.default.TYPE_STRING:
            case String:
              if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && typeof value['toString'] === 'function') {
                value = value.toString();
              }
              break;
            case _schema2.default.TYPE_NUMBER:
            case Number:
              break;
            default:
              break;
          }
        }
      }
      _get(Model.prototype.__proto__ || Object.getPrototypeOf(Model.prototype), 'set', this).call(this, field, value);
    }
  }, {
    key: 'toObject',
    value: function toObject() {
      var _this3 = this;

      var SCHEMA = this.constructor.getSchema();
      var item = {};
      SCHEMA.forEach(function (field, options) {
        item[field] = _this3.get(field);
      });
      return item;
    }

    /**
     * Save model
     * @returns {Promise}
     */

  }, {
    key: 'save',
    value: function save() {
      return this.constructor.getRepository().update(this.all(), this.getIdentity());
    }

    /**
     * Remove current model from database
     * @returns {Promise}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      return this.constructor.getRepository().delete(this.getIdentity());
    }
  }], [{
    key: 'getName',
    value: function getName() {
      throw new _notImplemented2.default('[Db/Model.getName] static method getName must be implemented');
    }

    /**
     * Get repository
     * @abstract
     * @returns {Repository}
     */

  }, {
    key: 'getRepository',
    value: function getRepository() {
      throw new _notImplemented2.default('[Db/Model.getRepository] static method getRepository must be implemented');
    }

    /**
     * Get schema
     * @abstract
     * @returns {Schema}
     */

  }, {
    key: 'getSchema',
    value: function getSchema() {
      throw new _notImplemented2.default();
    }
  }]);

  return Model;
}(_bag2.default);

exports.default = Model;
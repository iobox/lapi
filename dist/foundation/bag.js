'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

var _internalError = require('../exception/internal-error');

var _internalError2 = _interopRequireDefault(_internalError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function copy() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return Object.assign.apply(Object, [{}].concat(args));
}

function keys(source) {
  return Object.keys(source);
}

function values(source) {
  var values = [];
  keys(source).forEach(function (key) {
    return values.push(source[key]);
  });
  return values;
}

function iterator() {
  var _keys = void 0,
      _values = void 0;
  if (this instanceof Bag) {
    _keys = this.keys, _values = this.values;
  } else {
    _keys = keys(this), _values = values(this);
  }
  this[Symbol.iterator] = function () {
    return loop(_keys, _values);
  };
  return this;
}

function loop(keys, values) {
  var length = keys.length;
  var position = 0;

  return {
    next: function next() {
      return position < length ? {
        value: [keys[position], values[position++]],
        done: false
      } : { done: true };
    }
  };
}

/**
 * An alternative for Map to handle key-value data
 */

var Bag = function () {
  /**
   * Constructor
   * @param {?Object} [data={}] Initial object data
   */
  function Bag() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Bag);

    this.replace(data);
    iterator.apply(this);
  }

  /**
   * Return size (total items)
   * @returns {number}
   */


  _createClass(Bag, [{
    key: 'size',
    value: function size() {
      return this.length;
    }

    /**
     * Return total items
     * @returns {number}
     */

  }, {
    key: 'replace',


    /**
     * Replace the current data with new one
     * @param {?{}} [data={}] Data to replace
     */
    value: function replace() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._data = copy(data || {});
    }

    /**
     * Determine whether or not a key exists in Bag
     * @param {!string} key
     * @returns {boolean}
     */

  }, {
    key: 'has',
    value: function has(key) {
      return !(this._data[key] === undefined);
    }

    /**
     * Get value of a pre-defined key
     * @param {!string} key
     * @param {?*} [def=null] Default value to return if key does not exist
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(key) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.has(key) ? this._data[key] : def;
    }

    /**
     * Set a key-value pair
     * @param {!string} key
     * @param {?*} value
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      this._data[key] = value;
    }

    /**
     * Remove a value by key
     * @param {!string} key
     */

  }, {
    key: 'delete',
    value: function _delete(key) {
      delete this._data[key];
    }

    /**
     * Set multiple key-value pairs
     * @param {Object|Bag} data
     * @throws {InvalidArgumentException} throws an exception when input data is not an instance of Bag or an object
     */

  }, {
    key: 'extend',
    value: function extend(data) {
      var _this = this;

      if (data instanceof Bag) {
        data.forEach(function (key, value) {
          return _this.set(key, value);
        });
      } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
        this.extend(new Bag(data));
      } else {
        throw new _invalidArgument2.default('[Foundation/Bag#extend] data must be an instance of Bag or an object');
      }
    }

    /**
     * Return a cloned version of Bag data
     * @returns {{}}
     */

  }, {
    key: 'all',
    value: function all() {
      var _this2 = this;

      var bag = {};
      this.keys.forEach(function (key) {
        return bag[key] = _this2.get(key);
      });
      return bag;
    }

    /**
     * Get key-value pairs only for proposed keys
     * @param {?Array} keys An array of keys to get their's values
     * @returns {{}}
     * @throws {InvalidArgumentException} throws an exception when keys is not an array
     */

  }, {
    key: 'only',
    value: function only(keys) {
      var _this3 = this;

      if (!Array.isArray(keys)) {
        throw new _invalidArgument2.default('[Foundation/Bag#only] keys must be an array');
      }
      var bag = {};
      keys.forEach(function (key) {
        return bag[key] = _this3.get(key);
      });
      return bag;
    }

    /**
     * Get key-value pairs except for proposed keys
     * @param {?Array} keys An array of keys to ignore their's values
     * @returns {{}}
     * @throws {InvalidArgumentException} throws an exception when keys is not an array
     */

  }, {
    key: 'except',
    value: function except(keys) {
      var _this4 = this;

      if (!Array.isArray(keys)) {
        throw new _invalidArgument2.default('[Foundation/Bag#only] keys must be an array');
      }
      var bag = {};
      keys.forEach(function (key) {
        if (!keys.includes(key)) {
          bag[key] = _this4.get(key);
        }
      });
      return bag;
    }
  }, {
    key: 'raw',
    value: function raw(keys) {
      var _this5 = this;

      var raw = {};
      if (keys !== undefined && !Array.isArray(keys)) {
        throw new _invalidArgument2.default('[Foundation/Bag#raw] keys must be an array');
      } else if (keys === undefined) {
        keys = this.keys;
      }
      keys.forEach(function (key) {
        return raw[key] = _this5.has(key) ? _this5._data[key] : null;
      });
      return raw;
    }

    /**
     * Clear all data
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._data = {};
    }

    /**
     * Combine all key-value pairs into string with a proposed delimiter
     * @param {?Array} [keys=null] (Optional) only render key-value pairs which has key in this pre-defined keys
     * @param {?string} [delimiter='&'] Conjunction of string to connect key-value pairs
     * @returns {string}
     */

  }, {
    key: 'toString',
    value: function toString() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '&';

      var data = [],
          string = '';

      if (Array.isArray(keys)) {
        data = this.only(keys);
      } else {
        data = this.all();
      }

      Object.keys(data).forEach(function (key) {
        string += (string === '' ? '' : delimiter) + (key + '=' + data[key]);
      });
      return string;
    }

    /**
     * Convert bag to JSON string
     * @param {Array} keys Only for some keys
     * @param {boolean} [throws=true] Throws exception on error
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var throws = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var data = {};
      if (Array.isArray(keys)) {
        data = this.only(keys);
      } else {
        data = this.all();
      }

      try {
        JSON.stringify(data);
      } catch (e) {
        if (throws) {
          throw new _internalError2.default('[Foundation/Bag#toJSON] ' + e.message);
        } else {
          return JSON.stringify({});
        }
      }
    }

    /**
     * Loop through data with a callback
     * @param {function} callback A callback function to handle item,
     *                            it would receive 2 parameters (key, value) as the input
     * @param {?Object} target An object to become 'this argument' (receiver) of the callback
     */

  }, {
    key: 'forEach',
    value: function forEach(callback) {
      var _this6 = this;

      var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.keys.forEach(function (key) {
        if (target === null) {
          callback(key, _this6.get(key));
        } else {
          callback.apply(target, [key, _this6.get(key)]);
        }
      });
    }

    /**
     * Return an iterator to be looped through data of Bag
     * @param {?Array} keys (Optional) Only allow to loop pre-defined keys
     * @returns {function} Iterator function to be used as for..of
     */

  }, {
    key: 'entries',
    value: function entries() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      return iterator.apply(keys === null ? this : this.only(keys));
    }
  }, {
    key: 'length',
    get: function get() {
      return this.keys.length;
    }

    /**
     * Return all keys in Bag
     * @returns {Array}
     */

  }, {
    key: 'keys',
    get: function get() {
      return keys(this._data);
    }

    /**
     * Return all values in Bag
     * @returns {Array}
     */

  }, {
    key: 'values',
    get: function get() {
      return values(this._data);
    }
  }]);

  return Bag;
}();

exports.default = Bag;
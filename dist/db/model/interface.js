'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notImplemented = require('../../exception/not-implemented');

var _notImplemented2 = _interopRequireDefault(_notImplemented);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelInterface = function () {
  function ModelInterface() {
    _classCallCheck(this, ModelInterface);
  }

  _createClass(ModelInterface, [{
    key: 'getId',

    /**
     * Return identity of Model
     * @returns {string|number}
     */
    value: function getId() {
      throw new _notImplemented2.default();
    }

    /**
     * Set value of model's property by key
     * @param {string} key
     * @param {*} value
     */

  }, {
    key: 'set',
    value: function set(key, value) {
      throw new _notImplemented2.default();
    }

    /**
     * Get model's property
     * @param {string} key
     * @param {*} [def=null]
     */

  }, {
    key: 'get',
    value: function get(key) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      throw new _notImplemented2.default();
    }

    /**
     * Return key-value pairs
     * @param {Array} keys if this argument is null, it would return all keys
     * @returns {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      var keys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      throw new _notImplemented2.default();
    }

    /**
     * Save model
     * @returns {Promise}
     */

  }, {
    key: 'save',
    value: function save() {
      throw new _notImplemented2.default();
    }

    /**
     * Remove current model from database
     * @returns {Promise}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      throw new _notImplemented2.default();
    }
  }]);

  return ModelInterface;
}();

exports.default = ModelInterface;
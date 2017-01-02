'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notImplemented = require('../../exception/not-implemented');

var _notImplemented2 = _interopRequireDefault(_notImplemented);

var _interface = require('../model/interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RepositoryInterface = function () {
  function RepositoryInterface() {
    _classCallCheck(this, RepositoryInterface);
  }

  _createClass(RepositoryInterface, [{
    key: 'find',

    /**
     * Find records by condition
     * @param {Object} condition
     * @returns {ModelInterface[]}
     */
    value: function find(condition) {
      throw new _notImplemented2.default();
    }

    /**
     * Find one record
     * @param {Object} condition
     * @returns {ModelInterface}
     */

  }, {
    key: 'findOne',
    value: function findOne(condition) {
      throw new _notImplemented2.default();
    }

    /**
     * Create and return a model
     * @param {Object} model
     * @returns {ModelInterface}
     */

  }, {
    key: 'create',
    value: function create(model) {
      throw new _notImplemented2.default();
    }

    /**
     * Update records
     * @param {Object} data
     * @param {Object} condition
     */

  }, {
    key: 'update',
    value: function update(data, condition) {
      throw new _notImplemented2.default();
    }

    /**
     * Delete records
     * @param {Object} condition
     */

  }, {
    key: 'delete',
    value: function _delete(condition) {
      throw new _notImplemented2.default();
    }
  }]);

  return RepositoryInterface;
}();

exports.default = RepositoryInterface;
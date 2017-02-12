'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notImplemented = require('../exception/not-implemented');

var _notImplemented2 = _interopRequireDefault(_notImplemented);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbInterface = function () {
  function DbInterface() {
    _classCallCheck(this, DbInterface);
  }

  _createClass(DbInterface, [{
    key: 'open',

    /**
     * Open a new connection to database
     * @returns {Promise}
     */
    value: function open() {
      throw new _notImplemented2.default('[Db/db#open] this method must be implemented');
    }

    /**
     * Close existent connection
     * @returns {Promise}
     */

  }, {
    key: 'close',
    value: function close() {
      throw new _notImplemented2.default('[Db/db#close] this method must be implemented');
    }

    /**
     * Find record(s)
     * @param {string} collection
     * @param {Object} condition
     * @param {Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'find',
    value: function find(collection, condition) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      throw new _notImplemented2.default('[Db/db#find] this method must be implemented');
    }

    /**
     * Find one record
     * @param {string} collection
     * @param {Object} condition
     * @param {Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'findOne',
    value: function findOne(collection, condition) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      throw new _notImplemented2.default('[Db/db#findOne] this method must be implemented');
    }

    /**
     * Insert record(s)
     * @param {string} collection
     * @param {Array|Object} data if data is an array, it would be multiple insertion
     * @param {Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'insert',
    value: function insert(collection, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      throw new _notImplemented2.default('[Db/db#insert] this method must be implemented');
    }

    /**
     * Update record(s)
     * @param {string} collection
     * @param {Object} condition Condition to update
     * @param {Object} data Only contains new changes
     * @param {Object} [options=null] Additional configuration for updating
     * @returns {Promise}
     */

  }, {
    key: 'update',
    value: function update(collection, condition, data) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      throw new _notImplemented2.default('[Db/db#update] this method must be implemented');
    }

    /**
     * Delete record(s)
     * @param {string} collection
     * @param {Object} condition
     * @param {Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'delete',
    value: function _delete(collection, condition) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      throw new _notImplemented2.default('[Db/db#delete] this method must be implemented');
    }
  }]);

  return DbInterface;
}();

exports.default = DbInterface;
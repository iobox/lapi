'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _notImplemented = require('../exception/not-implemented');

var _notImplemented2 = _interopRequireDefault(_notImplemented);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

var _notFound = require('../exception/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _containerAware = require('../di/container-aware');

var _containerAware2 = _interopRequireDefault(_containerAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Repository = function (_ContainerAware) {
  _inherits(Repository, _ContainerAware);

  function Repository() {
    _classCallCheck(this, Repository);

    return _possibleConstructorReturn(this, (Repository.__proto__ || Object.getPrototypeOf(Repository)).apply(this, arguments));
  }

  _createClass(Repository, [{
    key: 'getDb',


    /**
     * Get Db
     * @returns {Db}
     * @throws {NotFoundException} throws an exception when there is none of instance of Db is registered in container
     * @throws {InvalidArgumentException} throws an exception if internal db instance is not an instance of Db
     */
    value: function getDb() {
      if (!this.getContainer().has('db')) {
        throw new _notFound2.default('[Db/Repository#getDb] db is not registered in DI/Container');
      }
      var db = this.getContainer().get('db');
      if (!(db instanceof _db2.default)) {
        throw new _invalidArgument2.default('[Db/Repository#getDb] db is null or not an instance of Db/Db');
      }
      return db;
    }

    /**
     * Create an instance of Model with appropriate data
     * @param {Object} data
     * @returns {Promise}
     */

  }, {
    key: 'create',
    value: function create(data) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var schema = _this2.constructor.getModel().constructor.getSchema();
        var model = new _this2.constructor.getModel()(data),
            tasks = [];
        schema.forEach(function (field, options) {
          if (!model.has(field)) {
            return false;
          }
          if (options.has(_schema2.default.REF)) {
            (function () {
              var ref = options.get(_schema2.default.REF);
              if (Array.isArray(ref)) {
                (function () {
                  var refs = model.get(field);
                  ref.forEach(function (dep, i) {
                    /* Loop dependencies */
                    if (dep instanceof _model2.default.constructor) {
                      tasks.push(new Promise(function (resolve, reject) {
                        dep.getRepository().findId(refs[i]).then(function (result) {
                          refs[i] = result;
                          model.set(field, refs);
                          resolve(result);
                        }).catch(function (e) {
                          return reject(e);
                        });
                      }));
                    }
                  });
                })();
              } else if (ref instanceof _model2.default) {
                tasks.push(new Promise(function (resolve, reject) {
                  ref.constructor.getRepository().findId(model.get(field)).then(function (result) {
                    model.set(field, result);
                    resolve(result);
                  }).catch(function (e) {
                    return reject(e);
                  });
                }));
              }
            })();
          }
        });
        Promise.all(tasks).then(function () {
          resolve(model);
        }).catch(function (e) {
          return reject(e);
        });
      });
    }

    /**
     * Find records by condition
     * @param {Object} condition
     * @returns {Promise}
     */

  }, {
    key: 'find',
    value: function find(condition) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.getDb().find(_this3.constructor.getModel().getName(), condition).then(function (items) {
          var models = [];
          var tasks = [];
          if (Array.isArray(items)) {
            items.forEach(function (item) {
              tasks.push(_this3.create(item).then(function (model) {
                return models.push(model);
              }));
            });
          }
          Promise.all(tasks).then(function () {
            resolve(models);
          }).catch(function (e) {
            return reject(e);
          });
        }).catch(function (e) {
          return reject(e);
        });
      });
    }

    /**
     * Find record by Id
     * @abstract
     * @param {string|number} id
     * @returns {Promise}
     */

  }, {
    key: 'findId',
    value: function findId(id) {
      throw new _notImplemented2.default();
    }

    /**
     * Find one record
     * @abstract
     * @param {Object} condition
     * @returns {Promise}
     */

  }, {
    key: 'findOne',
    value: function findOne(condition) {
      throw new _notImplemented2.default();
    }

    /**
     * Insert and return a model
     * @param {Object|Array} data
     * @param {?Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'insert',
    value: function insert(data) {
      var _this4 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return new Promise(function (resolve, reject) {
        if (Array.isArray(data)) {
          _this4.insertMany(data, options).then(function (r) {
            return resolve(r);
          }).catch(function (e) {
            return reject(e);
          });
        } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
          _this4.insertOne(data, options).then(function (r) {
            return resolve(r);
          }).catch(function (e) {
            return reject(e);
          });
        } else {
          reject(new _invalidArgument2.default('[Db/Repository#insert] data must be an object or an array'));
        }
      });
    }
  }, {
    key: 'insertMany',
    value: function insertMany(items) {
      var _this5 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return new Promise(function (resolve, reject) {
        var MODEL = _this5.constructor.getModel();
        var i = 0,
            data = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
              return reject(new _invalidArgument2.default('[Db/Repository#insertMany] each item must be an object'));
            } else if (!(item instanceof _model2.default)) {
              item = new MODEL(item);
              data.push(item.toObject());
            }
            i++;
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

        _this5.getDb().insert(MODEL.getName(), data, options).then(function (r) {
          var records = r.ops;
          var items = [];
          records.forEach(function (item) {
            return items.push(new MODEL(item));
          });
          resolve(items);
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: 'insertOne',
    value: function insertOne(item) {
      var _this6 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return new Promise(function (resolve, reject) {
        var MODEL = _this6.constructor.getModel();
        var data = null;
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
          return reject(new _invalidArgument2.default('[Db/Repository#insertMany] each item must be an object'));
        } else if (!(item instanceof _model2.default)) {
          var model = new MODEL(item);
          data = model.toObject();
        }
        _this6.getDb().insert(MODEL.getName(), data, options).then(function (r) {
          resolve(new MODEL(r.ops[0]));
        }).catch(function (e) {
          return reject(e);
        });
      });
    }

    /**
     * Update records
     * @abstract
     * @param {Object} data
     * @param {Object} condition
     * @param {?Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'update',
    value: function update(data, condition) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return this.getDb().update(this.constructor.getModel().getName(), data, condition, options);
    }

    /**
     * Delete records
     * @abstract
     * @param {Object} condition
     * @param {?Object} [options=null]
     * @returns {Promise}
     */

  }, {
    key: 'delete',
    value: function _delete(condition) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.getDb().delete(this.constructor.getModel().getName(), condition, options);
    }
  }], [{
    key: 'getModel',

    /**
     * Get Model
     * @returns {Model.constructor}
     */
    value: function getModel() {
      throw new _notImplemented2.default();
    }
  }]);

  return Repository;
}(_containerAware2.default);

exports.default = Repository;
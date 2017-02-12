'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MongoClient = require('mongodb');

var MongoDb = function (_DbInterface) {
  _inherits(MongoDb, _DbInterface);

  function MongoDb(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, MongoDb);

    var _this = _possibleConstructorReturn(this, (MongoDb.__proto__ || Object.getPrototypeOf(MongoDb)).call(this));

    _this._url = url;
    _this._options = options;
    return _this;
  }

  _createClass(MongoDb, [{
    key: 'open',
    value: function open() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        MongoClient.connect(_this2._url, _this2._options, function (err, db) {
          if (err) {
            reject(err);
          } else {
            resolve(db);
          }
        });
      });
    }
  }, {
    key: 'close',
    value: function close() {
      return new Promise(function (resolve, reject) {
        // We have nothing to do with closing
        resolve();
      });
    }
  }, {
    key: 'find',
    value: function find(collection, condition) {
      var _this3 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new Promise(function (resolve, reject) {
        options = new _bag2.default(options || {});
        _this3.open().then(function (db) {
          var query = db.collection(collection).find(condition);
          if (options.has('skip')) {
            query.skip(options.get('skip'));
          }
          if (options.has('limit')) {
            query.limit(options.get('limit'));
          }
          query.toArray(function (err, docs) {
            db.close();
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          });
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: 'findOne',
    value: function findOne(collection, condition) {
      var _this4 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new Promise(function (resolve, reject) {
        _this4.find(collection, condition, {
          skip: 0,
          limit: 1
        }).then(function (items) {
          if (items.length === 1) {
            resolve(items[0]);
          } else {
            resolve(null);
          }
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: 'insert',
    value: function insert(collection, data) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (Array.isArray(data)) {
        return this.insertMany(collection, data, options);
      } else {
        return this.insertOne(collection, data, options);
      }
    }
  }, {
    key: 'insertOne',
    value: function insertOne(collection, data) {
      var _this5 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new Promise(function (resolve, reject) {
        _this5.open().then(function (db) {
          db.collection(collection).insertOne(data, options, function (err, result) {
            db.close();
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: 'insertMany',
    value: function insertMany(collection, data) {
      var _this6 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new Promise(function (resolve, reject) {
        _this6.open().then(function (db) {
          db.collection(collection).insertMany(data, options, function (err, result) {
            db.close();
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: 'update',
    value: function update(collection, condition, data) {
      var _this7 = this;

      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      return new Promise(function (resolve, reject) {
        _this7.open().then(function (db) {
          options = new _bag2.default(options || {});
          if (options.get('multi', true)) {
            db.collection(collection).updateMany(condition, {
              $set: data
            }, options.only(['w', 'multi', 'upsert', 'wtimeout', 'j']), function (err, result) {
              db.close();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          } else {
            db.collection(collection).updateOne(condition, {
              $set: data
            }, options.only(['w', 'multi', 'upsert', 'wtimeout', 'j', 'bypassDocumentValidation']), function (err, result) {
              db.close();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          }
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: 'delete',
    value: function _delete(collection, condition) {
      var _this8 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return new Promise(function (resolve, reject) {
        _this8.open().then(function (db) {
          options = new _bag2.default(options || {});
          if (options.get('multi', true)) {
            db.collection(collection).deleteMany(condition, options.only(['w', 'wtimeout', 'j']), function (err, result) {
              db.close();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          } else {
            db.collection(collection).deleteOne(condition, options.only(['w', 'wtimeout', 'j']), function (err, result) {
              db.close();
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          }
        }).catch(function (e) {
          return reject(e);
        });
      });
    }
  }]);

  return MongoDb;
}(_interface2.default);

exports.default = MongoDb;
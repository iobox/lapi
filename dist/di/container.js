'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Definition = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _containerAware = require('./container-aware');

var _containerAware2 = _interopRequireDefault(_containerAware);

var _notFound = require('../exception/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Function.prototype.construct = function (args) {
  var instance = Object.create(this.prototype);
  this.apply(instance, args);
  return instance;
};

var Definition = exports.Definition = function () {
  function Definition(instance) {
    var shareable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    _classCallCheck(this, Definition);

    this.instance = instance;
    this.shareable = shareable;
  }

  _createClass(Definition, [{
    key: 'get',
    value: function get() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (this.shareable) {
        return this.instance;
      } else {
        if (typeof this.instance === 'function') {
          return this.instance.construct(args);
        } else if (_typeof(this.instance) === 'object') {
          return Object.assign({}, this.instance);
        } else {
          throw new _invalidArgument2.default('[Definition#get] Unexpected type of instance');
        }
      }

      return null;
    }
  }, {
    key: 'set',
    value: function set(instance) {
      this.instance = instance;
    }
  }, {
    key: 'share',
    value: function share() {
      var shareable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.shareable = shareable;
    }
  }]);

  return Definition;
}();

var Container = function () {
  function Container() {
    _classCallCheck(this, Container);

    this._definitions = {};
  }

  /**
   * Determine whether or not a name is registered
   * @param {string} name
   * @returns {boolean}
   */


  _createClass(Container, [{
    key: 'has',
    value: function has(name) {
      return this._definitions[name] !== undefined;
    }

    /**
     * Get instance of a registered name
     * @param {string} name
     * @param {Array} args
     * @returns {*}
     * @throws {NotFoundException} throws an exeception when name is not registered in container
     */

  }, {
    key: 'get',
    value: function get(name) {
      if (this.has(name)) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return this._definitions[name].get(args);
      } else {
        throw new _notFound2.default('[Container#get] ' + name + ' is not registered in container');
      }
    }

    /**
     * Set instance to a specific name
     * @param {string} name
     * @param {*} instance
     * @param {boolean} shareable
     * @returns {Definition}
     */

  }, {
    key: 'set',
    value: function set(name, instance) {
      var shareable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (instance instanceof _containerAware2.default) {
        instance.setContainer(this);
      }

      if (this.has(name)) {
        this._definitions[name].set(instance);
        this._definitions[name].share(shareable);
      } else {
        this._definitions[name] = new Definition(instance, shareable);
      }

      return this._definitions[name];
    }

    /**
     * Remove a name from Container
     * @param {string} name
     */

  }, {
    key: 'remove',
    value: function remove(name) {
      if (this.has(name)) {
        delete this._definitions[name];
      }
    }

    /**
     * Set shareable for a registered name
     * @param {string} name
     * @param {boolean} shareable
     */

  }, {
    key: 'share',
    value: function share(name) {
      var shareable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this.has(name)) {
        this._definitions[name].share(shareable);
      } else {
        throw new _notFound2.default('[Container#get] ' + name + ' is not registered in container');
      }
    }

    /**
     * Get definition by name
     * @param {string} name
     * @returns {null|Definition}
     */

  }, {
    key: 'getDefinition',
    value: function getDefinition(name) {
      return this.has(name) ? this._definitions[name] : null;
    }

    /**
     * Set definition by name
     * @param {string} name
     * @param {Definition} definition
     */

  }, {
    key: 'setDefinition',
    value: function setDefinition(name, definition) {
      this._definitions[name] = definition;
    }
  }]);

  return Container;
}();

exports.default = Container;
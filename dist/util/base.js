'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function () {
  function Base(source) {
    _classCallCheck(this, Base);

    this._source = source;
  }

  /**
   * Create new instance of Base from source
   * @param {Object} source
   * @returns {Base}
   */


  _createClass(Base, [{
    key: 'use',
    value: function use(target, methods) {
      var source = this._source;
      switch (_typeof(this._source)) {
        case 'object':
          source = this._source.constructor;
          break;
        case 'function':
        default:
          source = this._source;
          break;
      }

      Object.getOwnPropertyNames(target.prototype).concat(Object.getOwnPropertySymbols(target.prototype)).forEach(function (prop) {
        if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          return;
        }

        var method = prop;
        if ((typeof methods === 'undefined' ? 'undefined' : _typeof(methods)) === 'object' && methods[prop] !== undefined) {
          method = methods[prop];
        }
        Object.defineProperty(source.prototype, method, Object.getOwnPropertyDescriptor(target.prototype, prop));
      });

      return this;
    }
  }, {
    key: 'uses',
    value: function uses() {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.forEach(function (arg) {
        _this.use.apply(_this, arg);
      });
    }

    /**
     * Clone an object
     * It is only useful to clone an object which has no arguments in constructor
     * @returns {*}
     */

  }, {
    key: 'clone',
    value: function clone() {
      var constructor = this._source.constructor;
      return Object.assign(new constructor(), this._source);
    }
  }], [{
    key: 'from',
    value: function from(source) {
      return new Base(source);
    }
  }]);

  return Base;
}();

exports.default = Base;
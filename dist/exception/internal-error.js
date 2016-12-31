'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exception = require('../foundation/exception');

var _exception2 = _interopRequireDefault(_exception);

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InternalErrorException = function (_Exception) {
  _inherits(InternalErrorException, _Exception);

  function InternalErrorException() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, InternalErrorException);

    var _this = _possibleConstructorReturn(this, (InternalErrorException.__proto__ || Object.getPrototypeOf(InternalErrorException)).call(this, message, code));

    _this.setArguments(args || new _bag2.default());
    return _this;
  }

  /**
   * Get Exception's arguments
   * @returns {Bag}
   */


  _createClass(InternalErrorException, [{
    key: 'getArguments',
    value: function getArguments() {
      return this._arguments;
    }

    /**
     * Set Exception's arguments
     * @param {Object|Bag} args
     */

  }, {
    key: 'setArguments',
    value: function setArguments(args) {
      if (args instanceof _bag2.default) {
        this._arguments = args;
      } else if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object') {
        this._arguments = new _bag2.default(args);
      }
    }

    /**
     * Check if key exist
     * @param {!string} key
     * @returns {boolean}
     */

  }, {
    key: 'has',
    value: function has(key) {
      return this.getArguments().has(key);
    }

    /**
     * Get argument by key
     * @param {!string} key
     * @param {?*} [def=null]
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(key) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.getArguments().get(key, def);
    }
  }]);

  return InternalErrorException;
}(_exception2.default);

exports.default = InternalErrorException;
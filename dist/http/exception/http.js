'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exception = require('../../exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpException = function (_Exception) {
  _inherits(HttpException, _Exception);

  /**
   * Constructor
   * @param {string} [message='']
   * @param {?(number|string)} [code=null]
   * @param {?number} [statusCode=null]
   */
  function HttpException() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, HttpException);

    var _this = _possibleConstructorReturn(this, (HttpException.__proto__ || Object.getPrototypeOf(HttpException)).call(this, message, code));

    _this.setStatusCode(statusCode);
    return _this;
  }

  /**
   * Get HTTP Status Code
   * @returns {number}
   */


  _createClass(HttpException, [{
    key: 'getStatusCode',
    value: function getStatusCode() {
      return this._statusCode;
    }

    /**
     * Set HTTP Status Code
     * @param {number} statusCode
     * @throws {Exception} throws an exception if statusCode is not an integer
     */

  }, {
    key: 'setStatusCode',
    value: function setStatusCode(statusCode) {
      if (Number.isInteger(statusCode)) {
        this._statusCode = statusCode;
      } else {
        throw new _exception2.default('[Http/Exception/Http#setStatusCode] statusCode must be an integer');
      }
    }
  }]);

  return HttpException;
}(_exception2.default);

exports.default = HttpException;
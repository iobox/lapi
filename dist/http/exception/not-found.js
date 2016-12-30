'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _response = require('../response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotFoundException = function (_HttpException) {
  _inherits(NotFoundException, _HttpException);

  function NotFoundException() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var statusCode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _response2.default.HTTP_NOT_FOUND;

    _classCallCheck(this, NotFoundException);

    return _possibleConstructorReturn(this, (NotFoundException.__proto__ || Object.getPrototypeOf(NotFoundException)).call(this, message, code, statusCode));
  }

  return NotFoundException;
}(_http2.default);

exports.default = NotFoundException;
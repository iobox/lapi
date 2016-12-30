'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _body = require('./body');

var _body2 = _interopRequireDefault(_body);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _invalidArgument = require('./exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * HTTP Response
 */
var Response = function (_Message) {
  _inherits(Response, _Message);

  /**
   * Constructor
   * @param {?(string|Object)} [content={}] Response's body content
   * @param {!number} [statusCode=200] Response's status code, default is OK
   * @param {?Object} [header={}] Initial headers
   */
  function Response() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Response.HTTP_OK;
    var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Response);

    var _this = _possibleConstructorReturn(this, (Response.__proto__ || Object.getPrototypeOf(Response)).call(this));

    if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object') {
      _this.getBody().setContent(JSON.stringify(content));
      _this.getBody().setContentType(_body2.default.CONTENT_JSON);
      _this.getHeader().set(_header2.default.CONTENT_TYPE, _body2.default.CONTENT_JSON);
    } else if (typeof content === 'string') {
      _this.getBody().setContent(content);
      _this.getBody().setContentType(_body2.default.CONTENT_HTML);
      _this.getHeader().set(_header2.default.CONTENT_TYPE, _body2.default.CONTENT_HTML);
    } else {
      throw new _invalidArgument2.default('[Http/Response#constructor] content must be either an object or a string');
    }
    _this.setStatusCode(statusCode);
    _this.getHeader().extend(header);
    return _this;
  }

  /**
   * Get HTTP Status Code
   * @returns {number}
   */


  _createClass(Response, [{
    key: 'getStatusCode',
    value: function getStatusCode() {
      return this._statusCode;
    }

    /**
     * Set HTTP Status Code
     * @param {!number} statusCode
     */

  }, {
    key: 'setStatusCode',
    value: function setStatusCode(statusCode) {
      this._statusCode = statusCode;
    }

    /**
     * Send response to client
     * @param {?Object} resource Original response's resource. It should be an instance of http.ServerResponse
     */

  }, {
    key: 'send',
    value: function send() {
      var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getHeader()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          resource.setHeader(key, value);
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

      resource.statusCode = this.getStatusCode();
      resource.end(this.getBody().toString());
    }
  }]);

  return Response;
}(_message2.default);

exports.default = Response;

Response.HTTP_OK = 200;
Response.HTTP_CREATED = 201;
Response.HTTP_ACCEPTED = 202;
Response.HTTP_NO_CONTENT = 204;
Response.HTTP_RESET_CONTENT = 205;
Response.HTTP_MOVED_PERMANENTLY = 301;
Response.HTTP_FOUND = 302;
Response.HTTP_NOT_MODIFIED = 304;
Response.HTTP_BAD_REQUEST = 400;
Response.HTTP_UNAUTHORIZED = 401;
Response.HTTP_FORBIDDEN = 403;
Response.HTTP_NOT_FOUND = 404;
Response.HTTP_METHOD_NOT_ALLOWED = 404;
Response.HTTP_REQUEST_TIMEOUT = 408;
Response.HTTP_TOO_MANY_REQUESTS = 429;
Response.HTTP_INTERNAL_ERROR = 500;
Response.HTTP_NOT_IMPLEMENTED = 501;
Response.HTTP_BAD_GATEWAY = 502;
Response.HTTP_SERVICE_UNAVAILABLE = 503;
Response.HTTP_GATEWAY_TIMEOUT = 504;
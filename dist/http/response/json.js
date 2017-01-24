'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _body = require('../body');

var _body2 = _interopRequireDefault(_body);

var _response = require('./../response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JsonResponse = function (_Response) {
  _inherits(JsonResponse, _Response);

  function JsonResponse() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _response2.default.HTTP_OK;
    var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, JsonResponse);

    var _this = _possibleConstructorReturn(this, (JsonResponse.__proto__ || Object.getPrototypeOf(JsonResponse)).call(this, '', statusCode, header));

    _this.setContent(data);
    return _this;
  }

  /**
   * Set content
   * @param {Object} content
   */


  _createClass(JsonResponse, [{
    key: 'setContent',
    value: function setContent(content) {
      this.getBody().setContentType(_body2.default.CONTENT_JSON);
      this.getBody().setContent(JSON.stringify(content));
    }

    /**
     * Get content
     * @returns {Object}
     */

  }, {
    key: 'getContent',
    value: function getContent() {
      return this.getBody().getParsedContent();
    }
  }]);

  return JsonResponse;
}(_response2.default);

exports.default = JsonResponse;
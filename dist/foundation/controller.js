'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _kernel = require('./kernel');

var _kernel2 = _interopRequireDefault(_kernel);

var _request = require('../http/request');

var _request2 = _interopRequireDefault(_request);

var _response = require('../http/response');

var _response2 = _interopRequireDefault(_response);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

var _route = require('../http/routing/route');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controller = function (_Kernel) {
  _inherits(Controller, _Kernel);

  /**
   * Constructor
   * @param {?Request} [request=null]
   * @param {?Response} [response=null]
   */
  function Controller() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var response = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Controller);

    var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this));

    _this.setRequest(request || new _request2.default());
    _this.setResponse(response || new _response2.default());
    return _this;
  }

  /**
   * Get route
   * @returns {Route}
   */


  _createClass(Controller, [{
    key: 'getRoute',
    value: function getRoute() {
      return this._route;
    }

    /**
     * Set route
     * @param {!Route} route
     * @throws {InvalidArgumentException} throws an exception if route is not an instance of Route
     */

  }, {
    key: 'setRoute',
    value: function setRoute(route) {
      if (route instanceof _route2.default) {
        this._route = route;
      } else {
        throw new _invalidArgument2.default('[Foundation/Controller#setRoute] route must be an instance of Route');
      }
    }

    /**
     * Get Request
     * @returns {Request}
     */

  }, {
    key: 'getRequest',
    value: function getRequest() {
      return this._request;
    }

    /**
     * Set Request
     * @param {Request} request
     * @throws {InvalidArgumentException} throws an exception when request is not an instance of Request
     */

  }, {
    key: 'setRequest',
    value: function setRequest(request) {
      if (request instanceof _request2.default) {
        this._request = request;
      } else {
        throw new _invalidArgument2.default('[Foundation/Controller#setRequest] request must be an instance of Request');
      }
    }

    /**
     * Get Response
     * @returns {Response}
     */

  }, {
    key: 'getResponse',
    value: function getResponse() {
      return this._response;
    }

    /**
     * Set Response
     * @param {Response} response
     * @throws {InvalidArgumentException} throws an exception when response is not an instance of Response
     */

  }, {
    key: 'setResponse',
    value: function setResponse(response) {
      if (response instanceof _response2.default) {
        this._response = response;
      } else {
        throw new _invalidArgument2.default('[Foundation/Controller#setResponse] request must be an instance of Response');
      }
    }

    /**
     * This implementation means to be a solution for quick routing in App.
     * Therefore, override this method is prohibited
     * @param {function} action
     */

  }, {
    key: 'execute',
    value: function execute(action) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return action.apply(this, args);
    }
  }]);

  return Controller;
}(_kernel2.default);

exports.default = Controller;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('./bag');

var _bag2 = _interopRequireDefault(_bag);

var _containerAware = require('../di/container-aware');

var _containerAware2 = _interopRequireDefault(_containerAware);

var _container = require('../di/container');

var _container2 = _interopRequireDefault(_container);

var _router = require('../http/routing/router');

var _router2 = _interopRequireDefault(_router);

var _module = require('./extension/module');

var _module2 = _interopRequireDefault(_module);

var _manager = require('./extension/manager');

var _manager2 = _interopRequireDefault(_manager);

var _extension = require('./extension');

var _extension2 = _interopRequireDefault(_extension);

var _manager3 = require('../event/manager');

var _manager4 = _interopRequireDefault(_manager3);

var _empty = require('../logger/empty');

var _empty2 = _interopRequireDefault(_empty);

var _interface = require('../logger/interface');

var _interface2 = _interopRequireDefault(_interface);

var _request = require('../http/request');

var _request2 = _interopRequireDefault(_request);

var _header = require('../http/header');

var _header2 = _interopRequireDefault(_header);

var _route = require('../http/routing/route');

var _route2 = _interopRequireDefault(_route);

var _controller = require('../http/controller');

var _controller2 = _interopRequireDefault(_controller);

var _json = require('../http/response/json');

var _json2 = _interopRequireDefault(_json);

var _response = require('../http/response');

var _response2 = _interopRequireDefault(_response);

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

var _http = require('../http/exception/http');

var _http2 = _interopRequireDefault(_http);

var _internalError = require('../exception/internal-error');

var _internalError2 = _interopRequireDefault(_internalError);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

var _notFound = require('../http/exception/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var https = require('https');
var fs = require('fs');

/**
 * Contain information about original request, response
 */

var Connection = function Connection(req, res) {
  _classCallCheck(this, Connection);

  this.req = req;
  this.res = res;
};

var App = function (_ContainerAware) {
  _inherits(App, _ContainerAware);

  /**
   * Constructor
   * @param {Container} [container=null]
   */
  function App() {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, App);

    /**
     * Internal Extension Manager
     * @type {ExtensionManager}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, container));

    _this._extensionManager = new _manager2.default();
    return _this;
  }

  /**
   * Get Extension Manager
   * @returns {ExtensionManager}
   */


  _createClass(App, [{
    key: 'getExtensionManager',
    value: function getExtensionManager() {
      return this._extensionManager;
    }

    /**
     * Extend application with extension
     * @param {Extension} extension
     */

  }, {
    key: 'extend',
    value: function extend(extension) {
      this.getExtensionManager().extend(extension);
    }

    /**
     * @protected
     * @returns {LoggerInterface}
     */

  }, {
    key: 'getLogger',
    value: function getLogger() {
      return this.getContainer().get('foundation.app.logger');
    }

    /**
     * @protected
     * @returns {EventManager}
     */

  }, {
    key: 'getEvents',
    value: function getEvents() {
      return this.getContainer().get('foundation.app.events');
    }

    /**
     * @protected
     * @returns {Router}
     */

  }, {
    key: 'getRouter',
    value: function getRouter() {
      return this.getContainer().get('http.routing.router');
    }

    /**
     * @protected
     * @returns {Bag}
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.getContainer().get('foundation.app.options');
    }

    /**
     * Run application
     * @param {Object} [options=null] Optional configuration for application
     */

  }, {
    key: 'run',
    value: function run() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var container = this.getContainer();
      container.set('foundation.app.events', new _manager4.default());
      container.set('http.routing.router', new _router2.default());
      container.set('foundation.app.options', new _bag2.default((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {}));
      container.set('foundation.app.logger', new _empty2.default());

      try {
        this.setUpExtensions();
        this.setUpEvents();
        this.setUpServers();
      } catch (e) {
        this.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
      }
    }

    /**
     * @protected
     */

  }, {
    key: 'setUpExtensions',
    value: function setUpExtensions() {
      var container = this.getContainer();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getExtensionManager().getExtensions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var extension = _step.value;

          if (extension instanceof _extension2.default) {
            extension.setContainer(container);
          }
          if (extension instanceof _module2.default) {
            extension.setUp();
          }
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
    }

    /**
     * @protected
     */

  }, {
    key: 'setUpEvents',
    value: function setUpEvents() {
      var _this2 = this;

      this.getEvents().on('error', function (args, next) {
        _this2.getLogger().write(_interface2.default.TYPE_ERROR, args.get('error').getMessage());
        next();
      });
      this.getEvents().on('http.server.ready', function (args, next) {
        console.log('[info] Server is started at ' + args.get('host') + ':' + args.get('port'));
        next();
      });
      this.getEvents().on('foundation.controller.action.before', function (args, next) {
        var request = args.get('request'),
            route = args.get('route');
        _this2.getLogger().write(_interface2.default.TYPE_INFO, request.getMethod() + ' ' + request.getPath() + ' ' + request.getQuery().toString() + ' matches ' + route.getName(), [route.getMatches()]);
        next();
      });
      this.getEvents().on('system.error', function (args, next) {
        var response = new _json2.default({
          message: 'Oops! There is something wrong.'
        }, _response2.default.HTTP_INTERNAL_ERROR);
        var traces = [];
        var exception = args.get('exception');
        if (exception instanceof _internalError2.default && exception.has('request')) {
          var request = exception.get('request');
          if (request instanceof _request2.default) {
            traces = ['(Request.URI) ' + request.getMethod() + ' ' + request.getPath(), '(Request.Header) ' + request.getHeader().toString(), '(Request.ClientAddress) ' + request.getClient().get(_request2.default.CLIENT_HOST)];
          }
        }
        _this2.getLogger().write(_interface2.default.TYPE_ERROR, exception.getMessage(), traces);
        _this2.sendResponse(response, args.get('conn'));
        next();
      });
      this.getEvents().on('http.request.exception', function (args, next) {
        var response = null;
        var exception = args.get('exception');
        if (exception instanceof _internalError2.default) {
          response = new _json2.default({
            error: {
              message: exception.getMessage()
            }
          }, _response2.default.HTTP_INTERNAL_ERROR);
          _this2.getLogger().write(_interface2.default.TYPE_ERROR, exception.getMessage(), [exception.getArguments().all()]);
        } else if (exception instanceof _http2.default) {
          response = new _json2.default({
            error: {
              code: exception.getCode(),
              message: exception.getMessage()
            }
          }, exception.getStatusCode());
        } else if (exception instanceof Error) {
          _this2.getLogger().write(_interface2.default.TYPE_ERROR, exception.message);
        }

        if (response instanceof _response2.default) {
          _this2.sendResponse(response, args.get('conn'));
        }
        next();
      });
    }

    /**
     * @protected
     */

  }, {
    key: 'setUpServers',
    value: function setUpServers() {
      var _this3 = this;

      var protocol = this.getOptions().get('server.protocol', 'http');
      var server = null;
      try {
        if (protocol === 'https') {
          // set up HTTPS server
          server = this._setUpServerHttps();
        } else {
          // set up HTTP server
          server = this._setUpServerHttp();
        }
      } catch (e) {
        this.getEvents().emit('error', {
          error: new _internalError2.default(e.message)
        });
        return false;
      }

      if (server) {
        server.on('clientError', function (err, socket) {
          socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        server.on('request', function (req, res) {
          return _this3.handleRequest(req, res);
        });
      } else {
        this.getEvents().emit('error', {
          error: new _internalError2.default('Unable to set up a server')
        });
      }
    }

    /**
     * Start and return HTTP server instance
     * @returns {http.Server}
     * @private
     */

  }, {
    key: '_setUpServerHttp',
    value: function _setUpServerHttp() {
      var _this4 = this;

      var host = this.getOptions().get('server.host', null);
      var port = this.getOptions().get('server.port', 80);
      var backlog = this.getOptions().get('server.backlog', 511);
      return http.createServer().listen(port, host, backlog, function () {
        _this4.getEvents().emit('http.server.ready', {
          host: host,
          port: port
        });
      });
    }

    /**
     * Start and return HTTP server instance
     * @returns {https.Server}
     * @private
     */

  }, {
    key: '_setUpServerHttps',
    value: function _setUpServerHttps() {
      var _this5 = this;

      var host = this.getOptions().get('server.host', null);
      var port = this.getOptions().get('server.port', 443);
      var backlog = this.getOptions().get('server.backlog', 511);
      if (!this.getOptions().has('server.ssl.key') || !this.getOptions().has('server.ssl.cert')) {
        throw new _internalError2.default('server.ssl.key and server.ssl.cert must be configured in order to use HTTPS');
      }
      return https.createServer({
        key: fs.readFileSync(this.getOptions().get('server.ssl.key')),
        cert: fs.readFileSync(this.getOptions().get('server.ssl.cert'))
      }).listen(port, host, backlog, function () {
        _this5.getEvents().emit('http.server.ready', {
          host: host,
          port: port
        });
      });
    }

    /**
     * Handle incoming request
     * @param {http.IncomingRequest|https.IncomingRequest} req
     * @param {http.ServerResponse|https.ServerResponse} res
     * @throws {InternalErrorException} throws an exception when controller or action is not defined
     */

  }, {
    key: 'handleRequest',
    value: function handleRequest(req, res) {
      var _this6 = this;

      var conn = new Connection(req, res);
      var request = null;

      this.initRequest(conn).then(function (req) {
        request = req;
        return _this6.routeRequest(request);
      }).then(function (route) {
        return _this6.dispatchRequest(route, request);
      }).then(function (response) {
        return _this6.sendResponse(response, conn);
      }).catch(function (e) {
        return _this6.handleRequestError(e, conn, request);
      });
    }

    /**
     * Initialize request
     * @protected
     * @param {Connection} conn
     * @returns {Promise}
     */

  }, {
    key: 'initRequest',
    value: function initRequest(conn) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var request = _request2.default.from(conn.req);
            request.getUri().set(_request2.default.URI_PROTOCOL, _this7.getOptions().get('server.protocol', 'http'));
            if (request.getMethod() === _request2.default.METHOD_GET) {
              resolve(request);
            } else {
              (function () {
                var content = '';
                conn.req.on('data', function (buffer) {
                  content += buffer.toString('utf8');
                });
                conn.req.on('end', function () {
                  try {
                    request.getBody().setContent(content);
                    request.getBody().setContentType(request.getHeader().get(_header2.default.CONTENT_TYPE));
                    resolve(request);
                  } catch (e) {
                    reject(e);
                  }
                });
              })();
            }
          })();
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * Route request
     * @protected
     * @param {Request} request
     * @returns {Promise}
     */

  }, {
    key: 'routeRequest',
    value: function routeRequest(request) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        try {
          var route = _this8.getRouter().route(request);

          if (route instanceof _route2.default) {
            resolve(route);
          } else {
            reject(new _notFound2.default('Sorry! There is no routes found'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * Dispatch request
     * @protected
     * @param {Route} route
     * @param {Request} request
     * @returns {Promise}
     * @emits foundation.controller.action.before
     */

  }, {
    key: 'dispatchRequest',
    value: function dispatchRequest(route, request) {
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        var response = new _json2.default();
        var controller = route.getAttributes().get('controller');
        if (controller instanceof _controller2.default) {
          (function () {
            var action = route.getAttributes().get('action');
            if (action === null || action === '' || typeof action === 'string' && typeof controller[action] !== 'function') {
              reject(new _internalError2.default('action is not defined in controller', null, {
                'request': request,
                'response': response,
                'route': route
              }));
            }

            controller.setContainer(_this9.getContainer());
            controller.setRequest(request);
            controller.setResponse(response);
            controller.setRoute(route);

            _this9.getEvents().emit('foundation.controller.action.before', {
              controller: controller,
              action: action,
              request: request,
              route: route
            }).then(function () {
              var result = null;
              if (typeof action === 'function') {
                result = controller.action(action);
              } else {
                result = controller[action]();
              }
              if (result instanceof Promise) {
                result.then(function (result) {
                  _this9.handleActionResult(result, controller);
                  resolve(controller.getResponse());
                }).catch(function (e) {
                  reject(e);
                });
              } else {
                _this9.handleActionResult(result, controller);
                resolve(controller.getResponse());
              }
            }).catch(reject);
          })();
        } else {
          reject(new _internalError2.default('[foundation.App#dispatchRequest] controller is not defined or not an instance of http.Controller', null, {
            'request': request,
            'response': response,
            'route': route
          }));
        }
      });
    }

    /**
     * Handle result of controller's action
     * @protected
     * @param {*} result
     * @param {Controller} controller
     */

  }, {
    key: 'handleActionResult',
    value: function handleActionResult(result, controller) {
      if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
        var response = controller.getResponse();
        if (response instanceof _json2.default) {
          response.setContent(result);
        }
      } else if (result instanceof _response2.default) {
        controller.setResponse(result);
      } else {
        throw new _internalError2.default('[foundation.App#handleActionResult] result has unexpected format');
      }
    }

    /**
     * Send response to client
     * @protected
     * @param {Response} response
     * @param {Connection} conn
     * @returns {Promise}
     * @emits http.response.send.before
     */

  }, {
    key: 'sendResponse',
    value: function sendResponse(response, conn) {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        _this10.getEvents().emit('http.response.send.before', {
          response: response,
          conn: conn
        }).then(function () {
          try {
            response.send(conn.res);
            resolve(response);
          } catch (e) {
            _this10.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
            conn.res.end('');
          }
        }).catch(function (e) {
          return reject(e);
        });
      });
    }

    /**
     * Handle request errors
     * @protected
     * @param {Error|Exception} e
     * @param {Connection} conn
     * @param {?Request} [request=null]
     * @emits http.request.exception
     * @emits system.error
     */

  }, {
    key: 'handleRequestError',
    value: function handleRequestError(e, conn) {
      var request = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (e instanceof _exception2.default) {
        this.getEvents().emit('http.request.exception', {
          exception: e,
          conn: conn
        });
      } else if (e instanceof Error) {
        this.getEvents().emit('system.error', {
          exception: new _internalError2.default(e.message, null, {
            request: request
          }),
          conn: conn
        });
      }
    }
  }]);

  return App;
}(_containerAware2.default);

exports.default = App;
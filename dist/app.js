'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('./foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _containerAware = require('./di/container-aware');

var _containerAware2 = _interopRequireDefault(_containerAware);

var _container = require('./di/container');

var _container2 = _interopRequireDefault(_container);

var _router = require('./http/routing/router');

var _router2 = _interopRequireDefault(_router);

var _module = require('./foundation/extension/module');

var _module2 = _interopRequireDefault(_module);

var _manager = require('./foundation/extension/manager');

var _manager2 = _interopRequireDefault(_manager);

var _extension = require('./foundation/extension');

var _extension2 = _interopRequireDefault(_extension);

var _manager3 = require('./event/manager');

var _manager4 = _interopRequireDefault(_manager3);

var _empty = require('./logger/empty');

var _empty2 = _interopRequireDefault(_empty);

var _interface = require('./logger/interface');

var _interface2 = _interopRequireDefault(_interface);

var _request = require('./http/request');

var _request2 = _interopRequireDefault(_request);

var _header = require('./http/header');

var _header2 = _interopRequireDefault(_header);

var _route = require('./http/routing/route');

var _route2 = _interopRequireDefault(_route);

var _controller = require('./http/controller');

var _controller2 = _interopRequireDefault(_controller);

var _json = require('./http/response/json');

var _json2 = _interopRequireDefault(_json);

var _response = require('./http/response');

var _response2 = _interopRequireDefault(_response);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _http = require('./http/exception/http');

var _http2 = _interopRequireDefault(_http);

var _internalError = require('./exception/internal-error');

var _internalError2 = _interopRequireDefault(_internalError);

var _notFound = require('./http/exception/not-found');

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
    _this._registeredMiddlewares = new _bag2.default();
    _this._server = null;
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
     * Register a middleware
     * @param {string} name
     * @param {Function} middleware
     * @returns {App}
     */

  }, {
    key: 'use',
    value: function use(name, middleware) {
      this._registeredMiddlewares.set(name, middleware);
      return this;
    }

    /**
     * Start application
     * @param {Object} [options=null] Optional configuration for application
     */

  }, {
    key: 'start',
    value: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var container = this.getContainer();
      container.set('foundation.app.events', new _manager4.default());
      container.set('http.routing.router', new _router2.default());
      container.set('foundation.app.options', new _bag2.default((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {}));
      container.set('foundation.app.logger', new _empty2.default());

      return this.setUp();
    }

    /**
     * It runs when application is starting
     * @returns {Promise}
     */

  }, {
    key: 'setUp',
    value: function setUp() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          _this2.setUpExtensions();
          _this2.setUpEvents();
          _this2.setUpServer().then(function () {
            resolve(_this2._server);
          }).catch(function (e) {
            return reject(e);
          });
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * It runs when a response is sent to client
     */

  }, {
    key: 'tearDown',
    value: function tearDown() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getExtensionManager().getExtensions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var extension = _step.value;

          if (extension instanceof _module2.default) {
            extension.tearDown();
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
    key: 'setUpExtensions',
    value: function setUpExtensions() {
      var container = this.getContainer();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.getExtensionManager().getExtensions()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var extension = _step2.value;

          if (extension instanceof _extension2.default) {
            extension.setContainer(container);
          }
          if (extension instanceof _module2.default) {
            extension.setUp();
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
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
      var _this3 = this;

      this.getEvents().on('error', function (args, next) {
        _this3.getLogger().write(_interface2.default.TYPE_ERROR, args.get('error').getMessage());
        next();
      });
      this.getEvents().on('http.server.ready', function (args, next) {
        _this3.getLogger().write(_interface2.default.TYPE_INFO, '[info] Server is started at ' + args.get('host') + ':' + args.get('port'));
        next();
      });
      this.getEvents().on('foundation.controller.action.before', function (args, next) {
        var request = args.get('request'),
            route = args.get('route');
        _this3.getLogger().write(_interface2.default.TYPE_INFO, request.getMethod() + ' ' + request.getPath() + ' ' + request.getQuery().toString() + ' matches ' + route.getName(), [route.getMatches()]);
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
        _this3.getLogger().write(_interface2.default.TYPE_ERROR, exception.getMessage(), traces);
        _this3.sendResponse(response, args.get('conn'));
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
          _this3.getLogger().write(_interface2.default.TYPE_ERROR, exception.getMessage(), [exception.getArguments().all()]);
        } else if (exception instanceof _http2.default) {
          response = new _json2.default({
            error: {
              code: exception.getCode(),
              message: exception.getMessage()
            }
          }, exception.getStatusCode());
        } else if (exception instanceof Error) {
          _this3.getLogger().write(_interface2.default.TYPE_ERROR, exception.message);
        }

        if (response instanceof _response2.default) {
          _this3.sendResponse(response, args.get('conn'));
        }
        next();
      });
    }

    /**
     * @protected
     * @returns {Promise}
     */

  }, {
    key: 'setUpServer',
    value: function setUpServer() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var protocol = _this4.getOptions().get('server.protocol', 'http');
        if (protocol === 'https') {
          // set up HTTPS server
          _this4._setUpServerHttps().then(function () {
            _this4._setUpServerEvents();
            resolve();
          }).catch(function (e) {
            return reject(e);
          });
        } else {
          // set up HTTP server
          _this4._setUpServerHttp().then(function () {
            _this4._setUpServerEvents();
            resolve();
          }).catch(function (e) {
            return reject(e);
          });
        }
      });
    }

    /**
     * Set up related events handler to server
     * @private
     */

  }, {
    key: '_setUpServerEvents',
    value: function _setUpServerEvents() {
      var _this5 = this;

      this._server.on('clientError', function (err, socket) {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });
      this._server.on('request', function (req, res) {
        return _this5.handleRequest(req, res);
      });
    }

    /**
     * Start and return HTTP server instance
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_setUpServerHttp',
    value: function _setUpServerHttp() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var host = _this6.getOptions().get('server.host', null);
        var port = _this6.getOptions().get('server.port', 80);
        var backlog = _this6.getOptions().get('server.backlog', 511);
        try {
          _this6._server = http.createServer().listen(port, host, backlog, function () {
            _this6.getEvents().emit('http.server.ready', {
              host: host,
              port: port
            }).then(function () {
              resolve();
            });
          });
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * Start and return HTTP server instance
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_setUpServerHttps',
    value: function _setUpServerHttps() {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        var host = _this7.getOptions().get('server.host', null);
        var port = _this7.getOptions().get('server.port', 443);
        var backlog = _this7.getOptions().get('server.backlog', 511);
        if (!_this7.getOptions().has('server.ssl.key') || !_this7.getOptions().has('server.ssl.cert')) {
          reject(new _internalError2.default('server.ssl.key and server.ssl.cert must be configured in order to use HTTPS'));
        }
        try {
          _this7._server = https.createServer({
            key: fs.readFileSync(_this7.getOptions().get('server.ssl.key')),
            cert: fs.readFileSync(_this7.getOptions().get('server.ssl.cert'))
          }).listen(port, host, backlog, function () {
            _this7.getEvents().emit('http.server.ready', {
              host: host,
              port: port
            }).then(function () {
              resolve();
            });
          });
        } catch (e) {
          reject(e);
        }
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
      var _this8 = this;

      var conn = new Connection(req, res);
      var route = null,
          request = null,
          response = null;

      this.initRequest(conn).then(function (r) {
        request = r;
      }).then(function () {
        return _this8.routeRequest(request);
      }).then(function (r) {
        route = r;
      }).then(function () {
        return _this8.handleMiddlewares(route, request);
      }).then(function (r) {
        if (r instanceof _response2.default) response = r;
      }).then(function () {
        return _this8.dispatchRequest(route, request, response);
      }).then(function (r) {
        if (r instanceof _response2.default) response = r;
      }).then(function () {
        return _this8.sendResponse(response, conn);
      }).then(function () {
        return _this8.tearDown();
      }).catch(function (e) {
        return _this8.handleRequestError(e, conn, request, response);
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
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var request = _request2.default.from(conn.req);
            request.getUri().set(_request2.default.URI_PROTOCOL, _this9.getOptions().get('server.protocol', 'http'));
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
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        try {
          var route = _this10.getRouter().route(request);
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
     * Handle route's middlewares
     * @protected
     * @param {Route} route
     * @param {Request} request
     * @returns {Promise}
     */

  }, {
    key: 'handleMiddlewares',
    value: function handleMiddlewares(route, request) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        var middlewares = route.getMiddlewares();
        var response = null;
        if (middlewares.length) {
          (function () {
            var tasks = [];
            route.getMiddlewares().forEach(function (name) {
              if (!_this11._registeredMiddlewares.has(name)) {
                return false;
              }
              tasks.push(new Promise(function (resolve, reject) {
                try {
                  var r = _this11._registeredMiddlewares.get(name)(route, request);
                  if (r instanceof _response2.default) {
                    response = r;
                  }
                  resolve();
                } catch (e) {
                  reject(e);
                }
              }));
            });
            Promise.all(tasks).then(function () {
              return resolve(response);
            }).catch(function (e) {
              return reject(e);
            });
          })();
        } else {
          resolve(response);
        }
      });
    }

    /**
     * Dispatch request
     * @protected
     * @param {Route} route
     * @param {Request} request
     * @param {?Response} response
     * @returns {Promise}
     * @emits foundation.controller.action.before
     */

  }, {
    key: 'dispatchRequest',
    value: function dispatchRequest(route, request, response) {
      var _this12 = this;

      return new Promise(function (resolve, reject) {
        if (response instanceof _response2.default) {
          return resolve(response);
        } else {
          response = new _json2.default();
        }
        var controller = route.getAttributes().get('controller'),
            container = _this12.getContainer();
        if (controller instanceof _controller2.default) {
          var action = route.getAttributes().get('action');
          if (action === null || action === '' || typeof action === 'string' && typeof controller[action] !== 'function') {
            reject(new _internalError2.default('action is not defined in controller', null, {
              'request': request,
              'response': response,
              'route': route
            }));
          }

          controller.setContainer(container);
          controller.setRequest(request);
          controller.setResponse(response);
          controller.setRoute(route);

          var result = null;
          if (typeof action === 'function') {
            result = controller.action(action, request, response, container, route);
          } else {
            result = controller[action]();
          }
          if (result instanceof Promise) {
            result.then(function (result) {
              _this12.handleActionResult(result, controller);
              resolve(controller.getResponse());
            }).catch(function (e) {
              return reject(e);
            });
          } else {
            try {
              _this12.handleActionResult(result, controller);
              resolve(controller.getResponse());
            } catch (e) {
              reject(e);
            }
          }
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
      var _this13 = this;

      return new Promise(function (resolve, reject) {
        if (response === null || !(response instanceof _response2.default)) {
          reject(new _internalError2.default('An appropriate response could not be found'));
        } else {
          _this13.getEvents().emit('http.response.send.before', {
            response: response,
            conn: conn
          }).then(function () {
            try {
              response.send(conn.res);
              resolve(response);
            } catch (e) {
              _this13.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
              conn.res.end('');
            }
          }).catch(function (e) {
            return reject(e);
          });
        }
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
      var response = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      if (response instanceof _response2.default) {
        this.sendResponse(response, conn);
      } else if (e instanceof _exception2.default) {
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

    /**
     * Stop application
     * @returns {Promise}
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this14 = this;

      return new Promise(function (resolve, reject) {
        if (_this14._server === null) {
          resolve();
        } else {
          try {
            _this14._server.close(resolve);
          } catch (e) {
            reject(e);
          }
        }
      });
    }

    /**
     * Restart application
     * @returns {Promise.<TResult>}
     */

  }, {
    key: 'restart',
    value: function restart() {
      return this.stop().then(this.start);
    }
  }]);

  return App;
}(_containerAware2.default);

exports.default = App;
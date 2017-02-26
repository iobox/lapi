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

var _router = require('./http/routing/router');

var _router2 = _interopRequireDefault(_router);

var _manager = require('./event/manager');

var _manager2 = _interopRequireDefault(_manager);

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
   * @param {Object} [dependencies={}]
   */
  function App() {
    var dependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

    _this.getContainer().set('foundation.app.events', dependencies['events'] || new _manager2.default());
    _this.getContainer().set('http.routing.router', dependencies['router'] || new _router2.default());
    _this.getContainer().set('foundation.app.logger', dependencies['logger'] || new _empty2.default());
    return _this;
  }

  /**
   * @protected
   * @returns {LoggerInterface}
   */


  _createClass(App, [{
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
     * Start application
     * @param {Object} [options=null] Optional configuration for application
     */

  }, {
    key: 'start',
    value: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.getContainer().set('foundation.app.options', new _bag2.default((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {}));
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
          _this2.setUpEvents();
        } catch (e) {
          reject(e);
        }

        _this2.setUpServer().then(function (server) {
          _this2.getContainer().set('foundation.app.server', server);
          resolve(server);
        }).catch(function (e) {
          return reject(e);
        });
      });
    }

    /**
     * It runs when server is supposed to close
     */

  }, {
    key: 'tearDown',
    value: function tearDown() {
      this.getEvents().emit('foundation.app.tearDown', { app: this });
    }

    /**
     * @protected
     */

  }, {
    key: 'setUpEvents',
    value: function setUpEvents() {
      var _this3 = this;

      this.getEvents().emit('foundation.app.setUp', { app: this });
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
      var protocol = this.getOptions().get('server.protocol', 'http');
      return protocol === 'https' ? this._setUpServerHttps() : this._setUpServerHttp();
    }

    /**
     * Set up related events handler to server
     * @param {net.Server} server
     * @private
     */

  }, {
    key: '_setUpServerEvents',
    value: function _setUpServerEvents(server) {
      var _this4 = this;

      server.on('clientError', function (err, socket) {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
      });
      server.on('request', function (req, res) {
        return _this4.handleRequest(req, res);
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
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        var host = _this5.getOptions().get('server.host', null);
        var port = _this5.getOptions().get('server.port', 80);
        var backlog = _this5.getOptions().get('server.backlog', 511);
        try {
          var server = http.createServer().listen(port, host, backlog, function () {
            _this5._setUpServerEvents(server);
            _this5.getEvents().emit('http.server.ready', {
              host: host,
              port: port
            });
            resolve(server);
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
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var host = _this6.getOptions().get('server.host', null);
        var port = _this6.getOptions().get('server.port', 443);
        var backlog = _this6.getOptions().get('server.backlog', 511);
        if (!_this6.getOptions().has('server.ssl.key') || !_this6.getOptions().has('server.ssl.cert')) {
          reject(new _internalError2.default('server.ssl.key and server.ssl.cert must be configured in order to use HTTPS'));
        }
        try {
          var server = https.createServer({
            key: fs.readFileSync(_this6.getOptions().get('server.ssl.key')),
            cert: fs.readFileSync(_this6.getOptions().get('server.ssl.cert'))
          }).listen(port, host, backlog, function () {
            _this6._setUpServerEvents(server);
            _this6.getEvents().emit('http.server.ready', {
              host: host,
              port: port
            });
            resolve(server);
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
      var _this7 = this;

      var conn = new Connection(req, res);
      var route = null,
          request = null,
          response = null;

      this.initRequest(conn).then(function (r) {
        request = r;
      }).then(function () {
        return _this7.routeRequest(request);
      }).then(function (r) {
        route = r;
      }).then(function () {
        return _this7.handleMiddlewares(route, request);
      }).then(function (r) {
        if (r instanceof _response2.default) response = r;
      }).then(function () {
        return _this7.dispatchRequest(route, request, response);
      }).then(function (r) {
        if (r instanceof _response2.default) response = r;
      }).then(function () {
        return _this7.sendResponse(response, conn);
      }).then(function () {
        return _this7.tearDown();
      }).catch(function (e) {
        return _this7.handleRequestError(e, conn, request, response);
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
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        try {
          var request = _request2.default.from(conn.req);
          request.getUri().set(_request2.default.URI_PROTOCOL, _this8.getOptions().get('server.protocol', 'http'));
          if (request.getMethod() === _request2.default.METHOD_GET) {
            resolve(request);
          } else {
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
          }
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
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        try {
          var route = _this9.getRouter().route(request);
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
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        var middlewares = route.getMiddlewares();
        var response = null;
        if (middlewares.length) {
          var tasks = [];
          route.getMiddlewares().forEach(function (name) {
            if (!_this10.getRouter().getMiddlewares().has(name)) {
              return false;
            }
            tasks.push(new Promise(function (resolve, reject) {
              try {
                var r = _this10.getRouter().getMiddlewares().get(name)(route, request);
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
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        if (response instanceof _response2.default) {
          return resolve(response);
        } else {
          response = new _json2.default();
        }
        var controller = route.getAttributes().get('controller'),
            container = _this11.getContainer();
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
              _this11.handleActionResult(result, controller);
              resolve(controller.getResponse());
            }).catch(function (e) {
              return reject(e);
            });
          } else {
            try {
              _this11.handleActionResult(result, controller);
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
      var _this12 = this;

      return new Promise(function (resolve, reject) {
        if (response === null || !(response instanceof _response2.default)) {
          reject(new _internalError2.default('An appropriate response could not be found'));
        } else {
          _this12.getEvents().emit('http.response.send.before', {
            response: response,
            conn: conn
          }).then(function () {
            try {
              response.send(conn.res);
              resolve(response);
            } catch (e) {
              _this12.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
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
      var _this13 = this;

      return new Promise(function (resolve, reject) {
        if (_this13.getContainer().has('foundation.app.server')) {
          try {
            _this13.getContainer().get('foundation.app.server').close(resolve);
            _this13.getContainer().remove('foundation.app.server');
            _this13.tearDown();
          } catch (e) {
            reject(e);
          }
        } else {
          resolve();
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
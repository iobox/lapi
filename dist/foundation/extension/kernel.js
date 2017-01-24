'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('../bag');

var _bag2 = _interopRequireDefault(_bag);

var _exception = require('../../exception');

var _exception2 = _interopRequireDefault(_exception);

var _header = require('../../http/header');

var _header2 = _interopRequireDefault(_header);

var _controller = require('../../http/controller');

var _controller2 = _interopRequireDefault(_controller);

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

var _request = require('../../http/request');

var _request2 = _interopRequireDefault(_request);

var _response = require('../../http/response');

var _response2 = _interopRequireDefault(_response);

var _route = require('../../http/routing/route');

var _route2 = _interopRequireDefault(_route);

var _router = require('../../http/routing/router');

var _router2 = _interopRequireDefault(_router);

var _internalError = require('../../exception/internal-error');

var _internalError2 = _interopRequireDefault(_internalError);

var _file = require('../../logger/file');

var _file2 = _interopRequireDefault(_file);

var _interface = require('../../logger/interface');

var _interface2 = _interopRequireDefault(_interface);

var _http = require('../../http/exception/http');

var _http2 = _interopRequireDefault(_http);

var _notFound = require('../../http/exception/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

var _manager = require('../../event/manager');

var _manager2 = _interopRequireDefault(_manager);

var _console = require('../../logger/console');

var _console2 = _interopRequireDefault(_console);

var _json = require('../../http/response/json');

var _json2 = _interopRequireDefault(_json);

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

var KernelExtension = function (_ModuleExtension) {
  _inherits(KernelExtension, _ModuleExtension);

  function KernelExtension() {
    _classCallCheck(this, KernelExtension);

    return _possibleConstructorReturn(this, (KernelExtension.__proto__ || Object.getPrototypeOf(KernelExtension)).apply(this, arguments));
  }

  _createClass(KernelExtension, [{
    key: 'getName',
    value: function getName() {
      return 'foundation.extension.module.system';
    }

    /**
     * To set up some common objects, such as db, controller, request, response
     */

  }, {
    key: 'setUp',
    value: function setUp() {
      var _this2 = this;

      this.setUpEvents().then(this.setUpLogger()).then(this.setUpRouter()).then(this.setUpServer()).catch(function (e) {
        return _this2.handleSetUpError(e);
      });
    }

    /**
     * Get application's options
     * @returns {Bag}
     * @throws {Error} throws an error if application's options is not an instance of Bag
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      var options = this.getContainer().get('app.options');
      if (options instanceof _bag2.default) {
        return options;
      } else {
        throw new Error('[Foundation/Extension/SystemExtension#getOptions] application\'s options must be an instance of Bag');
      }
    }

    /**
     * Get events manager
     * @returns {EventManager}
     */

  }, {
    key: 'getEvents',
    value: function getEvents() {
      var events = this.getContainer().get('events');
      if (events instanceof _manager2.default) {
        return events;
      } else {
        throw new Error('[Foundation/Extension/SystemExtension#getEvents] events must be an instance of Event/EventManager');
      }
    }

    /**
     * Get logger
     * @returns {LoggerInterface}
     */

  }, {
    key: 'getLogger',
    value: function getLogger() {
      var logger = this.getContainer().get('logger');
      if (logger instanceof _interface2.default) {
        return logger;
      } else {
        throw new Error('[Foundation/Extension/SystemExtension#getLogger] logger must be an instance of Logger/LoggerInterface');
      }
    }

    /**
     * Set up events
     */

  }, {
    key: 'setUpEvents',
    value: function setUpEvents() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var events = new _manager2.default();
            var self = _this3;
            events.on('error', function (event) {
              self.getLogger().write(_interface2.default.TYPE_ERROR, event.error.message);
            });
            events.on('http.server.ready', function (args, next) {
              console.log('[info] Server is started at ' + args.get('host') + ':' + args.get('port'));
              next();
            });

            _this3.getContainer().set('events', events);
            resolve(events);
          })();
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * Set up application's logger
     */

  }, {
    key: 'setUpLogger',
    value: function setUpLogger() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var logger = null;
        var driver = _this4.getOptions().get('logger.driver', null);
        if (driver) {
          var options = _this4.getOptions().get('logger.options', null);
          switch (driver) {
            case 'file':
              logger = new _file2.default(options);
              break;
            case 'console':
              logger = new _console2.default(options);
              break;
            default:
              reject(new _internalError2.default('Invalid logger driver'));
              break;
          }
        }
        if (logger instanceof _interface2.default) {
          _this4.getContainer().set('logger', logger);
        } else {
          _this4.getContainer().set('logger', new _interface2.default());
        }
        resolve(logger);
      });
    }

    /**
     * Set up application's router
     */

  }, {
    key: 'setUpRouter',
    value: function setUpRouter() {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        try {
          var routes = _this5.getOptions().get('routes', []),
              router = new _router2.default(routes);
          _this5.getContainer().set('http.router', router);
          resolve(router);
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * @emits http.request emits an event "http.request" when receiving an incoming request
     */

  }, {
    key: 'setUpServer',
    value: function setUpServer() {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var protocol = _this6.getOptions().get('server.protocol', 'http');
        var server = null;
        try {
          if (protocol === 'https') {
            // set up HTTPS server
            server = _this6._setUpServerHttps();
          } else {
            // set up HTTP server
            server = _this6._setUpServerHttp();
          }
        } catch (e) {
          reject(e);
        }

        if (server) {
          server.on('clientError', function (err, socket) {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
          });
          server.on('request', function (req, res) {
            return _this6.handleRequest(req, res);
          });
          _this6.bindEvents();
          resolve(server);
        } else {
          reject(new _internalError2.default('Unable to set up a server'));
        }
      });
    }

    /**
     * Start and return HTTP server instance
     * @returns {http.Server}
     * @private
     */

  }, {
    key: '_setUpServerHttp',
    value: function _setUpServerHttp() {
      var _this7 = this;

      var host = this.getOptions().get('server.host', null);
      var port = this.getOptions().get('server.port', 80);
      var backlog = this.getOptions().get('server.backlog', 511);
      return http.createServer().listen(port, host, backlog, function () {
        _this7.getEvents().emit('http.server.ready', {
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
      var _this8 = this;

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
        _this8.getEvents().emit('http.server.ready', {
          host: host,
          port: port
        });
      });
    }
  }, {
    key: 'handleSetUpError',
    value: function handleSetUpError(e) {
      var logger = new _console2.default();
      if (e instanceof _exception2.default) {
        logger.write(_interface2.default.TYPE_ERROR, e.getMessage());
      } else {
        logger.write(_interface2.default.TYPE_ERROR, e.message);
      }
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
      var _this9 = this;

      var conn = new Connection(req, res);
      var request = null;

      this.initRequest(conn).then(function (req) {
        request = req;
        return _this9.routeRequest(request);
      }).then(function (route) {
        return _this9.dispatchRequest(route, request);
      }).then(function (response) {
        return _this9.sendResponse(response, conn);
      }).catch(function (e) {
        return _this9.handleRequestError(e, conn, request);
      });
    }
  }, {
    key: 'initRequest',
    value: function initRequest(conn) {
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var request = _request2.default.from(conn.req);
            request.getUri().set(_request2.default.URI_PROTOCOL, _this10.getOptions().get('server.protocol', 'http'));
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
     * @param {Request} request
     * @returns {Promise}
     */

  }, {
    key: 'routeRequest',
    value: function routeRequest(request) {
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        try {
          var router = _this11.getContainer().get('http.router'),
              route = router.route(request);

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
     * @param {Route} route
     * @param {Request} request
     * @returns {Promise}
     * @emits foundation.controller.action.before
     */

  }, {
    key: 'dispatchRequest',
    value: function dispatchRequest(route, request) {
      var _this12 = this;

      return new Promise(function (resolve, reject) {
        var response = new _json2.default();
        var controller = route.getOptions().get('controller');
        if (controller instanceof _controller2.default) {
          (function () {
            var action = route.getOptions().get('action');
            if (action === null || action === '' || typeof action === 'string' && typeof controller[action] !== 'function') {
              reject(new _internalError2.default('action is not defined in controller', null, {
                'request': request,
                'response': response,
                'route': route
              }));
            }

            controller.setContainer(_this12.getContainer());
            controller.setRequest(request);
            controller.setResponse(response);
            controller.setRoute(route);

            _this12.getEvents().emit('foundation.controller.action.before', {
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
                  _this12.handleActionResult(result, controller);
                  resolve(controller.getResponse());
                }).catch(function (e) {
                  reject(e);
                });
              } else {
                _this12.handleActionResult(result, controller);
                resolve(controller.getResponse());
              }
            }).catch(reject);
          })();
        } else {
          reject(new _internalError2.default('[Foundation/Extension/SystemExtension#dispatchRequest] controller is not defined or not an instance of Foundation/Controller', null, {
            'request': request,
            'response': response,
            'route': route
          }));
        }
      });
    }

    /**
     * Handle result of controller's action
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
        throw new _internalError2.default('[Foundation/Extension/SystemExtension#handleActionResult] result has unexpected format');
      }
    }

    /**
     * Send response to client
     * @param {Response} response
     * @param {Connection} conn
     * @returns {Promise}
     * @emits {string} emits event "http.response.send.before"
     */

  }, {
    key: 'sendResponse',
    value: function sendResponse(response, conn) {
      var _this13 = this;

      return new Promise(function (resolve, reject) {
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
      });
    }

    /**
     * Handle request errors
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

    /**
     * Bind events
     * @listens foundation.controller.action.before
     * @listens system.error
     * @listens http.request.exception
     */

  }, {
    key: 'bindEvents',
    value: function bindEvents() {
      var _this14 = this;

      this.getEvents().on('foundation.controller.action.before', function (args, next) {
        var request = args.get('request'),
            route = args.get('route');
        _this14.getLogger().write(_interface2.default.TYPE_INFO, request.getMethod() + ' ' + request.getPath() + ' ' + request.getQuery().toString() + ' matches ' + route.getName(), [route.getMatches()]);
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
        _this14.getLogger().write(_interface2.default.TYPE_ERROR, exception.getMessage(), traces);
        _this14.sendResponse(response, args.get('conn'));
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
          _this14.getLogger().write(_interface2.default.TYPE_ERROR, exception.getMessage(), [exception.getArguments().all()]);
        } else if (exception instanceof _http2.default) {
          response = new _json2.default({
            error: {
              code: exception.getCode(),
              message: exception.getMessage()
            }
          }, exception.getStatusCode());
        } else if (exception instanceof Error) {
          _this14.getLogger().write(_interface2.default.TYPE_ERROR, exception.message);
        }

        if (response instanceof _response2.default) {
          _this14.sendResponse(response, args.get('conn'));
        }
        next();
      });
    }
  }]);

  return KernelExtension;
}(_module2.default);

exports.default = KernelExtension;
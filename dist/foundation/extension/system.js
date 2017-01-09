'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('../bag');

var _bag2 = _interopRequireDefault(_bag);

var _body = require('../../http/body');

var _body2 = _interopRequireDefault(_body);

var _exception = require('../../exception/exception');

var _exception2 = _interopRequireDefault(_exception);

var _header = require('../../http/header');

var _header2 = _interopRequireDefault(_header);

var _controller = require('../controller');

var _controller2 = _interopRequireDefault(_controller);

var _module = require('./module');

var _module2 = _interopRequireDefault(_module);

var _request = require('../../http/request');

var _request2 = _interopRequireDefault(_request);

var _response = require('../../http/response/response');

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

var _event = require('../../event/event');

var _event2 = _interopRequireDefault(_event);

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

var ServerReadyEvent = function (_Event) {
  _inherits(ServerReadyEvent, _Event);

  function ServerReadyEvent(host, port) {
    _classCallCheck(this, ServerReadyEvent);

    var _this = _possibleConstructorReturn(this, (ServerReadyEvent.__proto__ || Object.getPrototypeOf(ServerReadyEvent)).call(this, 'http.server.ready', true));

    _this.host = host;
    _this.port = port;
    return _this;
  }

  return ServerReadyEvent;
}(_event2.default);

var UnexpectedErrorEvent = function (_Event2) {
  _inherits(UnexpectedErrorEvent, _Event2);

  function UnexpectedErrorEvent(error) {
    _classCallCheck(this, UnexpectedErrorEvent);

    var _this2 = _possibleConstructorReturn(this, (UnexpectedErrorEvent.__proto__ || Object.getPrototypeOf(UnexpectedErrorEvent)).call(this, 'error', true));

    _this2.error = error;
    return _this2;
  }

  return UnexpectedErrorEvent;
}(_event2.default);

var BeforeActionEvent = function (_Event3) {
  _inherits(BeforeActionEvent, _Event3);

  /**
   * Constructor
   * @param {Controller} controller
   */
  function BeforeActionEvent(controller, action) {
    _classCallCheck(this, BeforeActionEvent);

    var _this3 = _possibleConstructorReturn(this, (BeforeActionEvent.__proto__ || Object.getPrototypeOf(BeforeActionEvent)).call(this, 'foundation.controller.action.before'));

    _this3.controller = controller;
    _this3.action = action;
    return _this3;
  }

  return BeforeActionEvent;
}(_event2.default);

var BeforeSendResponseEvent = function (_Event4) {
  _inherits(BeforeSendResponseEvent, _Event4);

  /**
   * Constructor
   * @param {Response} response
   * @param {Connection} conn
   */
  function BeforeSendResponseEvent(response, conn) {
    _classCallCheck(this, BeforeSendResponseEvent);

    var _this4 = _possibleConstructorReturn(this, (BeforeSendResponseEvent.__proto__ || Object.getPrototypeOf(BeforeSendResponseEvent)).call(this, 'http.response.send.before'));

    _this4.response = response;
    _this4.conn = conn;
    return _this4;
  }

  return BeforeSendResponseEvent;
}(_event2.default);

var SystemErrorEvent = function (_Event5) {
  _inherits(SystemErrorEvent, _Event5);

  function SystemErrorEvent(error, conn) {
    _classCallCheck(this, SystemErrorEvent);

    var _this5 = _possibleConstructorReturn(this, (SystemErrorEvent.__proto__ || Object.getPrototypeOf(SystemErrorEvent)).call(this, 'system.error', true));

    _this5.error = error;
    _this5.conn = conn;
    return _this5;
  }

  return SystemErrorEvent;
}(_event2.default);

var IncomingRequestExceptionEvent = function (_Event6) {
  _inherits(IncomingRequestExceptionEvent, _Event6);

  function IncomingRequestExceptionEvent(exception, conn) {
    _classCallCheck(this, IncomingRequestExceptionEvent);

    var _this6 = _possibleConstructorReturn(this, (IncomingRequestExceptionEvent.__proto__ || Object.getPrototypeOf(IncomingRequestExceptionEvent)).call(this, 'http.request.exception'));

    _this6.exception = exception;
    _this6.conn = conn;
    return _this6;
  }

  return IncomingRequestExceptionEvent;
}(_event2.default);

var SystemExtension = function (_ModuleExtension) {
  _inherits(SystemExtension, _ModuleExtension);

  function SystemExtension() {
    _classCallCheck(this, SystemExtension);

    return _possibleConstructorReturn(this, (SystemExtension.__proto__ || Object.getPrototypeOf(SystemExtension)).apply(this, arguments));
  }

  _createClass(SystemExtension, [{
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
      var _this8 = this;

      this.setUpEvents().then(this.setUpLogger()).then(this.setUpRouter()).then(this.setUpServer()).catch(function (e) {
        return _this8.handleSetUpError(e);
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
      var _this9 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var events = new _manager2.default();
            var self = _this9;
            events.on('error', function (event) {
              self.getLogger().write(_interface2.default.TYPE_ERROR, event.error.message);
            });
            events.on('http.server.ready', function (event) {
              console.log('[info] Server is started at ' + event.host + ':' + event.port);
            });

            _this9.getContainer().set('events', events);
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
      var _this10 = this;

      return new Promise(function (resolve, reject) {
        var logger = null;
        var driver = _this10.getOptions().get('logger.driver', null);
        if (driver) {
          var options = _this10.getOptions().get('logger.options', null);
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
          _this10.getContainer().set('logger', logger);
        } else {
          _this10.getContainer().set('logger', new _interface2.default());
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
      var _this11 = this;

      return new Promise(function (resolve, reject) {
        var routes = _this11.getOptions().get('routes', []),
            router = new _router2.default(routes);
        _this11.getContainer().set('http.router', router);
        resolve(router);
      });
    }

    /**
     * @emits http.request emits an event "http.request" when receiving an incoming request
     */

  }, {
    key: 'setUpServer',
    value: function setUpServer() {
      var _this12 = this;

      return new Promise(function (resolve, reject) {
        var protocol = _this12.getOptions().get('server.protocol', 'http');
        var server = null;
        try {
          if (protocol === 'https') {
            // set up HTTPS server
            server = _this12._setUpServerHttps();
          } else {
            // set up HTTP server
            server = _this12._setUpServerHttp();
          }
        } catch (e) {
          reject(e);
        }

        if (server) {
          server.on('clientError', function (err, socket) {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
          });
          server.on('request', function (req, res) {
            _this12.handleIncomingRequest(req, res);
          });
          _this12.handleOutgoingResponse();
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
      var _this13 = this;

      var host = this.getOptions().get('server.host', null);
      var port = this.getOptions().get('server.port', 80);
      var backlog = this.getOptions().get('server.backlog', 511);
      return http.createServer().listen(port, host, backlog, function () {
        _this13.getEvents().emit(new ServerReadyEvent(host, port));
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
      var _this14 = this;

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
        _this14.getEvents().emit(new ServerReadyEvent(host, port));
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
     *
     * @emits http.request.before emits an event before performing controller's action
     * @emits http.request.after emits an event after performing controller's action
     * @emits http.response.send emits an event to send response if there is no errors
     * @emits http.request.not_found emits an event when no matched routes is found
     * @emits http.request.exception emits an event when an exception is thrown
     * @emits system.error emits an event when there is an unexpected error
     */

  }, {
    key: 'handleIncomingRequest',
    value: function handleIncomingRequest(req, res) {
      var _this15 = this;

      var conn = new Connection(req, res);
      var request = null;

      this.initRequest(conn).then(function (req) {
        request = req;
        return _this15.routeRequest(request);
      }).then(function (route) {
        return _this15.dispatchRequest(route, request);
      }).then(function (response) {
        return _this15.sendResponse(response, conn);
      }).catch(function (e) {
        return _this15.handleError(e, conn, request);
      });
    }
  }, {
    key: 'initRequest',
    value: function initRequest(conn) {
      var _this16 = this;

      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var request = _request2.default.from(conn.req);
            request.getUri().set(_request2.default.URI_PROTOCOL, _this16.getOptions().get('server.protocol', 'http'));
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
      var _this17 = this;

      return new Promise(function (resolve, reject) {
        try {
          var router = _this17.getContainer().get('http.router'),
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
     */

  }, {
    key: 'dispatchRequest',
    value: function dispatchRequest(route, request) {
      var _this18 = this;

      return new Promise(function (resolve, reject) {
        var response = new _json2.default();
        var controller = route.getOptions().get('controller');
        if (controller instanceof _controller2.default) {
          var action = route.getOptions().get('action');
          if (action === null || action === '' || typeof action === 'string' && typeof controller[action] !== 'function') {
            reject(new _internalError2.default('action is not defined in controller', null, {
              'request': request,
              'response': response,
              'route': route
            }));
          }

          controller.setContainer(_this18.getContainer());
          controller.setRequest(request);
          controller.setResponse(response);
          controller.setRoute(route);

          var onBeforeActionEventEmitted = function onBeforeActionEventEmitted(event) {
            var result = null,
                controller = event.controller,
                action = event.action;
            try {
              if (typeof action === 'function') {
                result = controller.action(action);
              } else {
                result = controller[action]();
              }
              if (result instanceof Promise) {
                result.then(function (result) {
                  _this18.handleActionResult(result, controller);
                  resolve(controller.getResponse());
                }).catch(function (e) {
                  reject(e);
                });
              } else {
                _this18.handleActionResult(result, controller);
                resolve(controller.getResponse());
              }
            } catch (e) {
              reject(e);
            }
          };

          _this18.getEvents().emit(new BeforeActionEvent(controller, action), onBeforeActionEventEmitted);
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
  }, {
    key: 'sendResponse',
    value: function sendResponse(response, conn) {
      var _this19 = this;

      return new Promise(function (resolve, reject) {
        _this19.getEvents().emit(new BeforeSendResponseEvent(response, conn), function (event) {
          try {
            event.response.send(event.conn.res);
            resolve(event.response);
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    /**
     * Handle errors
     * @param {Error|Exception} e
     * @param {Connection} conn
     * @param {?Request} [request=null]
     */

  }, {
    key: 'handleError',
    value: function handleError(e, conn) {
      var request = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (e instanceof _exception2.default) {
        this.getEvents().emit(new IncomingRequestExceptionEvent(e, conn));
      } else if (e instanceof Error) {
        this.getEvents().emit(new SystemErrorEvent(new _internalError2.default(e.message, null, {
          request: request
        }), conn));
      }
    }

    /**
     * Handle outgoing response
     * @listens {SystemErrorEvent} listens for any errors
     * @listens {IncomingRequestExceptionEvent} listens for exception from handling request
     */

  }, {
    key: 'handleOutgoingResponse',
    value: function handleOutgoingResponse() {
      var _this20 = this;

      this.getEvents().on('system.error', function (event, done) {
        var response = new _json2.default({
          message: 'Oops! There is something wrong.'
        }, _response2.default.HTTP_INTERNAL_ERROR);
        var traces = [];
        if (event.error instanceof _internalError2.default && event.error.has('request')) {
          var request = event.error.get('request');
          if (request instanceof _request2.default) {
            traces = ['(Request.URI) ' + request.getMethod() + ' ' + request.getPath(), '(Request.Header) ' + request.getHeader().toString(), '(Request.ClientAddress) ' + request.getClient().get(_request2.default.CLIENT_HOST)];
          }
        }
        _this20.getLogger().write(_interface2.default.TYPE_ERROR, event.error.getMessage(), traces);
        _this20.sendResponse(response, event.conn);
        done();
      });
      this.getEvents().on('http.request.exception', function (event, done) {
        var response = null;
        if (event.exception instanceof _internalError2.default) {
          response = new _json2.default({
            error: {
              message: event.exception.getMessage()
            }
          }, _response2.default.HTTP_INTERNAL_ERROR);
          _this20.getLogger().write(_interface2.default.TYPE_ERROR, event.exception.getMessage(), [event.exception.getArguments().all()]);
        } else if (event.exception instanceof _http2.default) {
          response = new _response2.default({
            error: {
              code: event.exception.getCode(),
              message: event.exception.getMessage()
            }
          }, event.exception.getStatusCode());
        } else if (event.exception instanceof Error) {
          _this20.getLogger().write(_interface2.default.TYPE_ERROR, event.exception.message);
        }

        if (response instanceof _response2.default) {
          _this20.sendResponse(response, event.conn);
        }
        done();
      });
    }
  }]);

  return SystemExtension;
}(_module2.default);

exports.default = SystemExtension;
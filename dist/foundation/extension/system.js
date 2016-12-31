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

var _exception = require('../exception');

var _exception2 = _interopRequireDefault(_exception);

var _header = require('../../http/header');

var _header2 = _interopRequireDefault(_header);

var _controller = require('../controller');

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = require('events');
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

var SystemExtension = function (_ModuleExtension) {
  _inherits(SystemExtension, _ModuleExtension);

  function SystemExtension() {
    _classCallCheck(this, SystemExtension);

    return _possibleConstructorReturn(this, (SystemExtension.__proto__ || Object.getPrototypeOf(SystemExtension)).apply(this, arguments));
  }

  _createClass(SystemExtension, [{
    key: 'setUp',

    /**
     * To set up some common objects, such as db, controller, request, response
     */
    value: function setUp() {
      this.setUpEvents();
      this.setUpLogger();
      this.setUpRouter();
      this.setUpServer();
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
        throw new Error('[Foundation/Extension/System#getOptions] application\'s options must be an instance of Bag');
      }
    }

    /**
     * Get events manager
     * @returns {EventEmitter}
     */

  }, {
    key: 'getEvents',
    value: function getEvents() {
      var events = this.getContainer().get('events');
      if (events instanceof EventEmitter) {
        return events;
      } else {
        throw new Error('[Foundation/Extension/System#getEvents] events must be an instance of EventEmitter');
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
        throw new Error('[Foundation/Extension/System#getLogger] logger must be an instance of LoggerInterface');
      }
    }

    /**
     * Set up events
     */

  }, {
    key: 'setUpEvents',
    value: function setUpEvents() {
      var events = new EventEmitter();
      var self = this;
      events.on('error', function (e) {
        self.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
      });
      events.on('http.server.ready', function (port, host) {
        console.log('[info] Server is started at ' + host + ':' + port);
      });

      this.getContainer().set('events', events);
    }

    /**
     * Set up application's logger
     */

  }, {
    key: 'setUpLogger',
    value: function setUpLogger() {
      var logger = null;
      var driver = this.getOptions().get('logger.driver', null);
      if (driver) {
        var options = this.getOptions().get('logger.options', null);
        switch (driver) {
          case 'file':
            logger = new _file2.default(options);
            break;
          default:
            break;
        }
      }
      if (logger instanceof _interface2.default) {
        this.getContainer().set('logger', logger);
      } else {
        this.getContainer().set('logger', new _interface2.default());
      }
    }

    /**
     * Set up application's router
     */

  }, {
    key: 'setUpRouter',
    value: function setUpRouter() {
      var routes = this.getOptions().get('routes', []);
      this.getContainer().set('http.router', new _router2.default(routes));
    }

    /**
     * @emits http.request emits an event "http.request" when receiving an incoming request
     */

  }, {
    key: 'setUpServer',
    value: function setUpServer() {
      var _this2 = this;

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
        this.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
      }

      if (server) {
        server.on('clientError', function (err, socket) {
          socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        server.on('request', function (req, res) {
          return _this2.handleIncomingRequest(req, res);
        });
        this.handleOutgoingResponse();
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
      var _this3 = this;

      var host = this.getOptions().get('server.host', null);
      var port = this.getOptions().get('server.port', 80);
      var backlog = this.getOptions().get('server.backlog', 511);
      return http.createServer().listen(port, host, backlog, function () {
        _this3.getEvents().emit('http.server.ready', port, host);
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
      var _this4 = this;

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
        _this4.getEvents().emit('http.server.ready', port, host);
      });
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
      var _this5 = this;

      this.conn = new Connection(req, res);
      this.request = null;
      this.makeRequest(this.conn).then(function (request) {
        _this5.request = request;
        return _this5.routeRequest(request);
      }).then(function (route) {
        return _this5.dispatchRequest(route, _this5.request);
      }).then(function (response) {
        return _this5.sendResponse(response, _this5.conn);
      }).catch(function (e) {
        return _this5.handleError(e, _this5.conn);
      });
    }

    /**
     * Make new request from resource
     * @param {Connection} conn
     * @returns {Promise}
     */

  }, {
    key: 'makeRequest',
    value: function makeRequest(conn) {
      return new Promise(function (resolve, reject) {
        try {
          (function () {
            var request = _request2.default.from(conn.req);
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
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var router = _this6.getContainer().get('http.router'),
            route = router.route(request);

        if (route instanceof _route2.default) {
          resolve(route);
        } else {
          reject(new _notFound2.default('Sorry! There is no routes found'));
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
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        var response = new _response2.default();
        var controller = route.getOptions().get('controller');
        if (controller instanceof _controller2.default) {
          var action = route.getOptions().get('action');
          if (action === null || action === '' || typeof controller[action] !== 'function') {
            reject(new _internalError2.default('action is not defined in controller', null, {
              'request': request,
              'response': response,
              'route': route
            }));
          }

          controller.setContainer(_this7.getContainer());
          controller.setRequest(request);
          controller.setResponse(response);
          controller.setRoute(route);

          _this7.getEvents().emit('http.request.before', controller);
          var content = controller[action]();
          _this7.getEvents().emit('http.request.after', content, controller);
          resolve(controller.getResponse());
        } else if (typeof controller === 'function') {
          _this7.getEvents().emit('http.request.before', controller);
          var _content = controller(request, response, route, _this7.getContainer());
          _this7.getEvents().emit('http.request.after', _content, response);
          resolve(response);
        } else {
          reject(new _internalError2.default('controller is not defined or not an instance of Foundation/Controller', null, {
            'request': request,
            'response': response,
            'route': route
          }));
        }
      });
    }

    /**
     * Send response
     * @param {Response} response
     * @param {Connection} conn
     * @returns {Promise}
     */

  }, {
    key: 'sendResponse',
    value: function sendResponse(response, conn) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        try {
          _this8.getEvents().emit('http.response.send.before', response);
          response.send(conn.res);
          _this8.getEvents().emit('http.response.send.after');
          resolve(response);
        } catch (e) {
          reject(e);
        }
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
        this.getEvents().emit('http.request.exception', e, conn);
      } else if (e instanceof Error) {
        this.getEvents().emit('system.error', conn.res, new _internalError2.default(e.message, null, {
          request: request
        }));
      }
    }

    /**
     * Handle outgoing response
     * @listens http.response.send listens for sending outgoing response event
     * @listens http.request.not_found listens for exception when there is no matched routes
     * @listens http.request.exception listens for exception from handling request
     * @listens http.request.after listens for result after perform controller's action
     */

  }, {
    key: 'handleOutgoingResponse',
    value: function handleOutgoingResponse() {
      var _this9 = this;

      this.getEvents().on('system.error', function (res, e) {
        var response = new _response2.default({
          message: 'Oops! There is something wrong.'
        }, _response2.default.HTTP_INTERNAL_ERROR);
        var traces = [];
        if (e instanceof _internalError2.default && e.has('request')) {
          var request = e.get('request');
          traces = ['[trace] (Request.URI) ' + request.getMethod() + ' ' + request.getPath(), '[trace] (Request.Header) ' + request.getHeader().toString(), '[trace] (Request.ClientAddress) ' + request.getClient().get(_request2.default.CLIENT_HOST)];
        }
        _this9.getLogger().write(_interface2.default.TYPE_ERROR, e.message, traces);
        _this9.getEvents().emit('http.response.send', response, res);
      });
      this.getEvents().on('http.request.exception', function (e, conn) {
        var response = null;
        if (e instanceof _internalError2.default) {
          response = new _response2.default({
            error: {
              message: e.getMessage()
            }
          }, _response2.default.HTTP_INTERNAL_ERROR);
          _this9.getLogger().write(_interface2.default.TYPE_ERROR, e.getMessage(), [JSON.stringify(e.getArguments().all())]);
        } else if (e instanceof _http2.default) {
          response = new _response2.default({
            error: {
              code: e.getCode(),
              message: e.getMessage()
            }
          }, e.getStatusCode());
        } else if (e instanceof Error) {
          _this9.getLogger().write(_interface2.default.TYPE_ERROR, e.getMessage());
        }

        if (response instanceof _response2.default) {
          _this9.sendResponse(response, conn);
        }
      });
      this.getEvents().on('http.request.after', function (content, controller) {
        if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) !== 'object') {
          return false;
        }
        var response = null;
        if (controller instanceof _controller2.default) {
          response = controller.getResponse();
        } else if (controller instanceof _response2.default) {
          response = controller;
        }

        if (response instanceof _response2.default) {
          response.getBody().setContent(JSON.stringify(content));
          response.getBody().setContentType(_body2.default.CONTENT_JSON);
        }
      });
    }
  }]);

  return SystemExtension;
}(_module2.default);

exports.default = SystemExtension;
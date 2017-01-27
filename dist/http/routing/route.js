'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bag = require('../../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _request = require('../request');

var _request2 = _interopRequireDefault(_request);

var _controller = require('../controller');

var _controller2 = _interopRequireDefault(_controller);

var _invalidArgument = require('../../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SRC_HOST = 'host';
var SRC_PATH = 'path';

function scanAndReplace(text, source, target) {
  if (text === null) {
    // do nothing
    return;
  }

  var o = Route.MATCH_OPENING_TAG,
      c = Route.MATCH_CLOSING_TAG;

  var pattern = o + '(\\w+)' + c,
      matches = text.match(new RegExp(pattern, 'ig')),
      args = Object.keys(source);

  if (matches === null || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object') {
    // do nothing
    return text;
  }

  // loop matches to replace in text
  matches.forEach(function (match) {
    var replacement = /\w+/,
        argument = match.replace(new RegExp(o + '|' + c, 'ig'), '');

    for (var i = 0; i < args.length; i++) {
      if (match === '' + o + args[i] + c) {
        argument = args[i];
        replacement = source[argument];
        break;
      }
    }

    if ((typeof replacement === 'undefined' ? 'undefined' : _typeof(replacement)) === 'object' && replacement instanceof RegExp) {
      replacement = replacement.toString();
      replacement = replacement.replace(/^\/(.*)\/[a-z]*$/ig, '$1');
    }

    text = text.replace(match, '(' + replacement + ')');
    target[argument] = null;
  });

  return text;
}

function matchAndApply(text, pattern, target) {
  if (text === undefined || pattern === undefined) {
    return false;
  }

  if (text === null) {
    return true;
  }

  var matches = text.match(pattern);
  if (matches === null) {
    return false;
  }

  var args = Object.keys(target);
  for (var i = 1; i < matches.length; i++) {
    target[args[i - 1]] = matches[i];
  }

  return true;
}

function validateRegExp(target) {
  if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target instanceof RegExp) {
    target = target.toString();
  }

  // consider to check for string only?
  return '^' + target + '$';
}

/**
 * Http Route
 */

var Route = function () {
  /**
   * Constructor
   * @example
   * let route = new Route(
   *   ['GET', 'POST'],
   *   '/accounts/{id}',
   *   '{language}.domain.com',
   *   6969,
   *   {id: /\d+/, language: /[a-zA-Z]{2}/},
   *   {controller: new SomeController(), action: "someAction"}
   * )
   *
   * @param {Array|string} [methods=null] Accepted methods for route
   * @param {string} [path=''] Path of route, regexp string is allowed
   * @param {?string} [host=null] Expected host, default is null to ignore host
   * @param {Object} [requirements={}] Requirements of matching, it is optional of have pre-defined required properties of matching
   * @param {Object} [attributes={}] Additional attributes of route, it would be merged with matches result
   * @param {Array} [middlewares=[]] Route's middlewares
   */
  function Route() {
    var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var host = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var requirements = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var attributes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var middlewares = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];

    _classCallCheck(this, Route);

    this.setName(null);
    this.setMethods(methods);
    this.setPath(path);
    this.setHost(host);
    this.setPort(null);
    this.setRequirements(requirements);
    this.setAttributes(attributes);
    this.setMiddlewares(middlewares);
    this.setMatches({});
  }

  /**
   * Get name
   * @returns {string}
   */


  _createClass(Route, [{
    key: 'getName',
    value: function getName() {
      return this._name;
    }

    /**
     * Set name
     * @param {?string} name Name of route, and it should be an unique string
     */

  }, {
    key: 'setName',
    value: function setName(name) {
      if (name === undefined) {
        throw new _invalidArgument2.default('[http.routing.route#setName] name must be a string.');
      }
      this._name = name;
    }

    /**
     * An alias of setName
     * @param {?string} name
     * @returns {Route}
     */

  }, {
    key: 'name',
    value: function name(_name) {
      this.setName(_name);
      return this;
    }

    /**
     * List of accepted methods
     * @returns {Array}
     */

  }, {
    key: 'getMethods',
    value: function getMethods() {
      return this._methods;
    }

    /**
     * In case methods is a string, it would be converted to an array with single item
     * @param {Array|string} methods
     */

  }, {
    key: 'setMethods',
    value: function setMethods(methods) {
      if (methods !== null && Array.isArray(methods) === false) {
        methods = [methods];
      }

      this._methods = methods;
    }

    /**
     * Get path
     * @returns {string|null}
     */

  }, {
    key: 'getPath',
    value: function getPath() {
      return this._path;
    }

    /**
     * Set path
     * @param {?string} path
     */

  }, {
    key: 'setPath',
    value: function setPath(path) {
      this._path = path;
    }

    /**
     * An alias of setPath
     * @param {?string} path
     * @returns {Route}
     */

  }, {
    key: 'path',
    value: function path(_path) {
      this.setPath(_path);
      return this;
    }

    /**
     * Get host
     * @returns {string|null}
     */

  }, {
    key: 'getHost',
    value: function getHost() {
      return this._host;
    }

    /**
     * Set host
     * @param {?string} host
     */

  }, {
    key: 'setHost',
    value: function setHost(host) {
      this._host = host;
    }

    /**
     * An alias of setHost
     * @param {string} host
     * @returns {Route}
     */

  }, {
    key: 'host',
    value: function host(_host) {
      this.setHost(_host);
      return this;
    }

    /**
     * Get port
     * @returns {int|null}
     */

  }, {
    key: 'getPort',
    value: function getPort() {
      return this._port;
    }

    /**
     * Set port
     * @param {?int} port
     */

  }, {
    key: 'setPort',
    value: function setPort(port) {
      this._port = port;
    }

    /**
     * An alias of setPort
     * @param {?int} port
     * @returns {Route}
     */

  }, {
    key: 'port',
    value: function port(_port) {
      this.setPort(_port);
      return this;
    }

    /**
     * Get requirements
     * @returns {Object}
     */

  }, {
    key: 'getRequirements',
    value: function getRequirements() {
      return this._requirements;
    }

    /**
     * Set requirements
     * @param {?Object} requirements
     */

  }, {
    key: 'setRequirements',
    value: function setRequirements(requirements) {
      this._requirements = requirements;
    }

    /**
     * An alias of setRequirements
     * @param {?Object} requirements
     * @returns {Route}
     */

  }, {
    key: 'require',
    value: function require(requirements) {
      this.setRequirements(requirements);
      return this;
    }

    /**
     * Route's middlewares
     * @returns {Array}
     */

  }, {
    key: 'getMiddlewares',
    value: function getMiddlewares() {
      return this._middlewares;
    }

    /**
     * Set options
     * @param {Array} middlewares
     * @throws {InvalidArgumentException} throws an exception when middlewares is not an array
     */

  }, {
    key: 'setMiddlewares',
    value: function setMiddlewares(middlewares) {
      if (!Array.isArray(middlewares)) {
        throw new _invalidArgument2.default('[http.routing.Route#setMiddlewares] middlewares must be an array');
      }
      this._middlewares = middlewares;
    }

    /**
     * An alias of setMiddlewares
     * @param {Array} middlewares
     * @returns {Route}
     */

  }, {
    key: 'middleware',
    value: function middleware(middlewares) {
      this.setMiddlewares(middlewares);
      return this;
    }

    /**
     * Get attributes
     * @returns {Bag}
     */

  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      return this._attributes;
    }

    /**
     * Set attributes
     * @param {Object|Bag} attributes
     * @throws {InvalidArgumentException} throws exception when attributes is not an instance of Bag or an object
     */

  }, {
    key: 'setAttributes',
    value: function setAttributes(attributes) {
      if (attributes instanceof _bag2.default) {
        this._attributes = attributes;
      } else if ((typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object') {
        this._attributes = new _bag2.default(attributes);
      } else {
        throw new _invalidArgument2.default('[http.routing.route#setAttributes] attributes must be either an instance of Bag or an object');
      }
    }

    /**
     * An alias of setAttributes
     * @param {Object|Bag} attributes
     * @returns {Route}
     */

  }, {
    key: 'with',
    value: function _with(attributes) {
      this.getAttributes().extend(attributes);
      return this;
    }

    /**
     * Get matches data
     * @returns {Object}
     */

  }, {
    key: 'getMatches',
    value: function getMatches() {
      return Object.assign({}, this._matches[SRC_HOST], this._matches[SRC_PATH]);
    }

    /**
     * Set matches data
     * @param {!Object} matches
     */

  }, {
    key: 'setMatches',
    value: function setMatches(matches) {
      this._matches = matches;
    }

    /**
     * Set Route's handler
     * @param {Controller|Function} controller Class of controller
     * @param {?(string|Function)} [action=null] name of action to be called
     * @returns {Route}
     */

  }, {
    key: 'handler',
    value: function handler(controller) {
      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (typeof controller === 'function' && action === null) {
        // In this case, controller is just a callable function,
        // then we convert it to Controller instance
        action = controller;
        controller = new _controller2.default();
      } else if (controller === null && typeof action === 'function') {
        // In this case, action is defined explicitly as a callable function,
        // then we convert it to Controller instance
        controller = new _controller2.default();
      } else if (!(controller instanceof _controller2.default)) {
        throw new _invalidArgument2.default('[http.routing.route#handler] controller must be an instance of Controller');
      }

      this.getAttributes().set('controller', controller || null);
      this.getAttributes().set('action', action || null);
      return this;
    }

    /**
     * Define whether or not a request has been matched to this route
     * @param {Request} request
     * @returns {boolean}
     */

  }, {
    key: 'match',
    value: function match(request) {
      /* Run pre-actions */
      this.preMatch();

      var isMatched = false;
      if ((this.getMethods() === null || this.getMethods().indexOf(request.getMethod()) >= 0) && (this.getHost() === null || matchAndApply(request.getHost(), this.getHost(), this._matches[SRC_HOST])) && (this.getPath() === null || matchAndApply(request.getPath(), this.getPath(), this._matches[SRC_PATH])) && (this.getPort() === null || !Number.isNaN(request.getPort()) && request.getPort() === this.getPort())) {
        isMatched = true;
      }

      /* Run post-actions */
      this.postMatch();

      return isMatched;
    }

    /**
     * Prepare before matching
     * @protected
     */

  }, {
    key: 'preMatch',
    value: function preMatch() {
      this.cleanUp();

      this._reservedHost = this.getHost();
      this._reservedPath = this.getPath();

      this.setHost(this.getHost() === null ? null : scanAndReplace(validateRegExp(this.getHost()), this.getRequirements(), this._matches[SRC_HOST]));
      this.setPath(this.getPath() === null ? null : scanAndReplace(validateRegExp(this.getPath()), this.getRequirements(), this._matches[SRC_PATH]));
    }

    /**
     * Perform actions after matching
     * @protected
     */

  }, {
    key: 'postMatch',
    value: function postMatch() {
      this.setHost(this._reservedHost);
      this.setPath(this._reservedPath);

      this._reservedHost = null;
      this._reservedPath = null;
    }

    /**
     * Clean up data
     * @protected
     */

  }, {
    key: 'cleanUp',
    value: function cleanUp() {
      this._matches[SRC_HOST] = {};
      this._matches[SRC_PATH] = {};
    }

    /**
     * Convert an object to route instance
     * @param {Object} object
     * @returns {Route}
     */

  }], [{
    key: 'from',
    value: function from(object) {
      var route = new this();
      route.setName(object.name || '');
      route.setMethods(object.methods || [_request2.default.DEFAULT_METHOD]);
      route.setPath(object.path || '');
      route.setHost(object.host || null);
      route.setPort(object.port || null);
      route.setMiddlewares(object.middlewares || []);
      route.setRequirements(object.requirements || {});
      route.setAttributes(object.attributes || {});

      return route;
    }
  }]);

  return Route;
}();

exports.default = Route;

Route.MATCH_OPENING_TAG = '{';
Route.MATCH_CLOSING_TAG = '}';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bag = require('../../bag');

var _bag2 = _interopRequireDefault(_bag);

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
   *   'route_name',
   *   ['GET', 'POST'],
   *   '/accounts/{id}',
   *   '{language}.domain.com',
   *   6969,
   *   {id: /\d+/, language: /[a-zA-Z]{2}/},
   *   {format: 'json'},
   *   {useDb: true}
   * )
   *
   * @param {string} [name=''] Name of route, it should be an unique string
   * @param {Array|string} [methods=null] Accepted methods for route
   * @param {string} [path=''] Path of route, regexp string is allowed
   * @param {?string} [host=null] Expected host, default is null to ignore host
   * @param {Object} [requirements={}] Requirements of matching, it is optional of have pre-defined required properties of matching
   * @param {Object} [attributes={}] Additional attributes of route, it would be merged with matches result
   * @param {Object} [options={}] Route's options contain optional configuration
   */
  function Route() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var host = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var requirements = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var attributes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};

    _classCallCheck(this, Route);

    this.setName(name);
    this.setMethods(methods);
    this.setPath(path);
    this.setHost(host);
    this.setPort(null);
    this.setRequirements(requirements);
    this.setAttributes(attributes);
    this.setOptions(options);
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
     * @param {!string} name
     */

  }, {
    key: 'setName',
    value: function setName(name) {
      if (name === undefined) {
        throw new Error('Name of route must be a string.');
      }
      this._name = name;
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
     * @param {Array} methods
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
     * Extra configuration for route
     * @returns {Bag}
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this._options;
    }

    /**
     * Set options
     * @param {Bag|Object} options
     */

  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        if (options instanceof _bag2.default) {
          this._options = options;
        } else {
          this._options = new _bag2.default(options);
        }
      }
    }

    /**
     * Get attributes
     * @returns {Object}
     */

  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      return this._attributes;
    }

    /**
     * Set attributes
     * @param {?Object} attributes
     */

  }, {
    key: 'setAttributes',
    value: function setAttributes(attributes) {
      this._attributes = attributes;
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
      if ((this.getMethods() === null || this.getMethods().indexOf(request.getMethod()) >= 0) && (this.getHost() === null || matchAndApply(request.getHost(), this.getHost(), this._matches[SRC_HOST])) && (this.getPath() === null || matchAndApply(request.getPath(), this.getPath(), this._matches[SRC_PATH])) && (this.getPort() === null || request.getPort() !== null && request.getPort() === this.getPort())) {
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
      route.setMethods(object.methods || []);
      route.setPath(object.path || '');
      route.setHost(object.host || null);
      route.setPort(object.port || null);
      route.setOptions(object.options || {});
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
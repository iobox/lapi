"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _bag = require("../../bag");

var _bag2 = _interopRequireDefault(_bag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SRC_HOST = "host";
var SRC_PATH = "path";

function scanAndReplace(text, source, target) {
  if (text === null) {
    // do nothing
    return;
  }

  var o = Route.MATCH_OPENING_TAG,
      c = Route.MATCH_CLOSING_TAG;

  var pattern = o + "(\\w+)" + c,
      matches = text.match(new RegExp(pattern, "ig")),
      args = Object.keys(source);

  if (matches === null || (typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object") {
    // do nothing
    return text;
  }

  // loop matches to replace in text
  matches.forEach(function (match) {
    var replacement = /\w+/,
        argument = match.replace(new RegExp(o + "|" + c, "ig"), "");

    for (var i = 0; i < args.length; i++) {
      if (match === "" + o + args[i] + c) {
        argument = args[i];
        replacement = source[argument];
        break;
      }
    }

    if ((typeof replacement === "undefined" ? "undefined" : _typeof(replacement)) === "object" && replacement instanceof RegExp) {
      replacement = replacement.toString();
      replacement = replacement.replace(/^\/(.*)\/[a-z]*$/ig, "$1");
    }

    text = text.replace(match, "(" + replacement + ")");
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
  if ((typeof target === "undefined" ? "undefined" : _typeof(target)) === "object" && target instanceof RegExp) {
    target = target.toString();
  }

  // consider to check for string only?
  return "^" + target + "$";
}

/**
 * Http Route
 */

var Route = function () {
  /**
   * Constructor
   * @example
   * let route = new Route(
   *   "route_name",
   *   ["GET", "POST"],
   *   "/accounts/{id}",
   *   "{language}.domain.com",
   *   6969,
   *   {id: /\d+/, language: /[a-zA-Z]{2}/},
   *   {format: "json"},
   *   {useDb: true}
   * )
   *
   * @param {string} [name=""] Name of route, it should be an unique string
   * @param {Array|string} [methods=null] Accepted methods for route
   * @param {string} [path=""] Path of route, regexp string is allowed
   * @param {string} [host=null] Expected host, default is null to ignore host
   * @param {number} [port=null] Expected port, default is null to ignore port
   * @param {Object} [demands={}] Requirements for regexp host or path
   * @param {Object} [params={}] Additional parameters to route, it would be merged with matches result
   * @param {Object} [options={}] Route's options contain optional configuration
   */
  function Route() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
    var host = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var port = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var demands = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    var params = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
    var options = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : {};

    _classCallCheck(this, Route);

    /**
     * Name of route
     * @type {string}
     */
    this.name = name;

    /**
     * A list of accepted methods
     * @type {Array}
     */
    this.methods = methods;

    /**
     * Path of request to be matched
     * @type {string}
     */
    this.path = path;

    /**
     * Host of request to be verified
     * @type {string}
     */
    this.host = host;

    /**
     * Expected port to be validated
     * @type {number}
     */
    this.port = port;

    /**
     * Requirements of matching, it is optional of have pre-defined required properties of matching
     * @type {Object}
     */
    this.demands = demands;

    /**
     * Additional or default parameters to be merged with final matches data
     * @type {Object}
     */
    this.params = params;

    /**
     * Extra configuration for route
     * @type {Object}
     */
    this.options = options;

    /**
     * Result of matching process
     * @type {Object}
     */
    this.matches = {};
  }

  /**
   * Get name
   * @returns {string}
   */


  _createClass(Route, [{
    key: "getName",
    value: function getName() {
      return this._name;
    }

    /**
     * Set name
     * @param {!string} name
     */

  }, {
    key: "setName",
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
    key: "getMethods",
    value: function getMethods() {
      return this._methods;
    }

    /**
     * In case methods is a string, it would be converted to an array with single item
     * @param {Array} methods
     */

  }, {
    key: "setMethods",
    value: function setMethods(methods) {
      if (methods !== null && Array.isArray(methods) === false) {
        methods = [methods];
      }

      this._methods = methods;
    }

    /**
     * Extra configuration for route
     * @returns {Bag}
     */

  }, {
    key: "getOptions",
    value: function getOptions() {
      return this._options;
    }

    /**
     * Set options
     * @param {Bag|Object} options
     */

  }, {
    key: "setOptions",
    value: function setOptions(options) {
      if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
        if (options instanceof _bag2.default) {
          this._options = options;
        } else {
          this._options = new _bag2.default(options);
        }
      }
    }

    /**
     * @returns {Object}
     */

  }, {
    key: "match",


    /**
     * Define whether or not a request has been matched to this route
     * @param {Request} request
     * @returns {boolean}
     */
    value: function match(request) {
      /* Run pre-actions */
      this.preMatch();

      var isMatched = false;
      if ((this.methods === null || this.methods.indexOf(request.method) >= 0) && (this.host === null || matchAndApply(request.host, this.host, this._matches[SRC_HOST])) && (this.path === null || matchAndApply(request.path, this.path, this._matches[SRC_PATH])) && (this.port === null || request.port !== null && request.port === this.port)) {
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
    key: "preMatch",
    value: function preMatch() {
      this.cleanUp();

      this.reservedHost = this.host;
      this.reservedPath = this.path;

      this.host = this.host === null ? null : scanAndReplace(validateRegExp(this.host), this.demands, this._matches[SRC_HOST]);
      this.path = this.path === null ? null : scanAndReplace(validateRegExp(this.path), this.demands, this._matches[SRC_PATH]);
    }

    /**
     * Perform actions after matching
     * @protected
     */

  }, {
    key: "postMatch",
    value: function postMatch() {
      this.host = this.reservedHost;
      this.path = this.reservedPath;

      this.reservedHost = null;
      this.reservedPath = null;
    }

    /**
     * Clean up data
     * @protected
     */

  }, {
    key: "cleanUp",
    value: function cleanUp() {
      this._matches[SRC_HOST] = {};
      this._matches[SRC_PATH] = {};
    }
  }, {
    key: "matches",
    get: function get() {
      return Object.assign({}, this._matches[SRC_HOST], this._matches[SRC_PATH]);
    }

    /**
     * @param {Object} matches
     */
    ,
    set: function set(matches) {
      this._matches = matches;
    }

    /**
     * Convert an object to route instance
     * @param {Object} object
     * @returns {Route}
     */

  }], [{
    key: "from",
    value: function from(object) {
      var route = new this();
      route.name = object.name || "";
      route.methods = object.methods || [];
      route.path = object.path || "";
      route.host = object.host || null;
      route.port = object.port || null;
      route.options = object.options || {};
      route.demands = object.demands || {};
      route.params = object.params || {};

      return route;
    }
  }]);

  return Route;
}();

exports.default = Route;

Route.MATCH_OPENING_TAG = "{";
Route.MATCH_CLOSING_TAG = "}";
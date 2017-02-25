'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _body = require('./body');

var _body2 = _interopRequireDefault(_body);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var url = require('url');

/**
 * Http Request
 *
 * Contains information about request
 */
var Request = function (_Message) {
  _inherits(Request, _Message);

  /**
   * Constructor
   */
  function Request() {
    _classCallCheck(this, Request);

    var _this = _possibleConstructorReturn(this, (Request.__proto__ || Object.getPrototypeOf(Request)).call(this));

    _this.setMethod(Request.DEFAULT_METHOD);
    _this.setUri(new _bag2.default());
    _this.setQuery(new _bag2.default());
    _this.setServer(new _bag2.default());
    _this.setClient(new _bag2.default());
    _this.setAttributes(new _bag2.default());
    return _this;
  }

  /**
   * Get request's method
   * @returns {string}
   */


  _createClass(Request, [{
    key: 'getMethod',
    value: function getMethod() {
      return this._method;
    }

    /**
     * Set request's method
     * @param {!string} method
     */

  }, {
    key: 'setMethod',
    value: function setMethod(method) {
      this._method = method;
    }

    /**
     * Get URI
     * @returns {Bag}
     */

  }, {
    key: 'getUri',
    value: function getUri() {
      return this._uri;
    }

    /**
     * Set URI
     * @param {!string|Bag|Object} uri
     */

  }, {
    key: 'setUri',
    value: function setUri(uri) {
      if (uri instanceof _bag2.default) {
        this._uri = uri;
      } else if ((typeof uri === 'undefined' ? 'undefined' : _typeof(uri)) === 'object') {
        this._uri = new _bag2.default(uri);
      } else if (typeof uri === 'string') {
        var info = url.parse(uri, true);
        this._uri.set(Request.URI_PROTOCOL, info.protocol);
        this._uri.set(Request.URI_HOST, info.hostname);
        this._uri.set(Request.URI_PORT, parseInt(info.port));
        this._uri.set(Request.URI_PATH, info.pathname);
        this._uri.set(Request.URI_HASH, info.hash);
        this._uri.set(Request.URI_HREF, info.href);
        this._uri.set(Request.URI_SEARCH, info.search);
        this.setQuery(info.query);
      } else {
        throw new Error('The request\'s URI must be an instance of Bag, an object or a string.');
      }
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
     */

  }, {
    key: 'setAttributes',
    value: function setAttributes(attributes) {
      if (attributes instanceof _bag2.default) {
        this._attributes = attributes;
      } else if ((typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object') {
        this._attributes = new _bag2.default(attributes);
      } else {
        throw new Error('Attributes of request must be either an instance of Bag or an object');
      }
    }

    /**
     * Get path from Uri
     * @returns {string}
     */

  }, {
    key: 'getPath',
    value: function getPath() {
      return this.getUri().get(Request.URI_PATH, Request.DEFAULT_PATH);
    }

    /**
     * Get host
     * @returns {string|null}
     */

  }, {
    key: 'getHost',
    value: function getHost() {
      return this.getUri().get(Request.URI_HOST);
    }

    /**
     * Get port
     * @returns {int}
     */

  }, {
    key: 'getPort',
    value: function getPort() {
      return this.getUri().get(Request.URI_PORT);
    }

    /**
     * Get request's query
     * @returns {Bag}
     */

  }, {
    key: 'getQuery',
    value: function getQuery() {
      return this._query;
    }

    /**
     * Set request's query
     * @param {Bag|Object|string} query
     */

  }, {
    key: 'setQuery',
    value: function setQuery(query) {
      if (query instanceof _bag2.default) {
        this._query = query;
      } else if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') {
        this._query = new _bag2.default(query);
      } else if (typeof query === 'string') {
        this._query = new _bag2.default(url.parse(query, true).query);
      } else {
        throw new Error('The query of request must be either a string, an instance of Bag or an object.');
      }
    }

    /**
     * Return a specific key if exists in request
     * @param {!string} key
     * @param {?*} [def=null] Default value to return if key does not exist
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(key) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.getAttributes().has(key)) {
        return this.getAttributes().get(key);
      } else if (this.getQuery().has(key)) {
        return this.getQuery().get(key);
      } else {
        return def;
      }
    }

    /**
     * Tells whether or not a key exists in request
     * @param {!string} key
     * @returns {boolean}
     */

  }, {
    key: 'has',
    value: function has(key) {
      return !!(this.getAttributes().has(key) || this.getQuery().has(key));
    }

    /**
     * Set an attribute by key
     * @param {!string} key
     * @param {*} [value=null]
     */

  }, {
    key: 'set',
    value: function set(key) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.getAttributes().set(key, value);
    }

    /**
     * Return server's information
     * @returns {Bag}
     */

  }, {
    key: 'getServer',
    value: function getServer() {
      return this._server;
    }

    /**
     * Set server's information
     * @param {Bag|Object} [server={}]
     */

  }, {
    key: 'setServer',
    value: function setServer() {
      var server = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (server instanceof _bag2.default) {
        this._server = server;
      } else if ((typeof server === 'undefined' ? 'undefined' : _typeof(server)) === 'object') {
        this._server = new _bag2.default(server);
      } else {
        throw new Error('The request\'s server information must be either an instance of Bag or an object.');
      }
    }

    /**
     * Return client's information
     * @returns {Bag}
     */

  }, {
    key: 'getClient',
    value: function getClient() {
      return this._client;
    }

    /**
     * Set client's information
     * @param {Bag|Object} [client={}]
     */

  }, {
    key: 'setClient',
    value: function setClient() {
      var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (client instanceof _bag2.default) {
        this._client = client;
      } else if ((typeof client === 'undefined' ? 'undefined' : _typeof(client)) === 'object') {
        this._client = new _bag2.default(client);
      } else {
        throw new Error('The request\'s client information must be either an instance of Bag or an object.');
      }
    }

    /**
     * Set Request content
     * @param {string|Object} content
     * @param {string} [contentType="application/json"]
     */

  }, {
    key: 'setContent',
    value: function setContent(content) {
      var contentType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _body2.default.CONTENT_JSON;

      if ((typeof content === 'undefined' ? 'undefined' : _typeof(content)) === 'object') {
        content = JSON.stringify(content);
      }
      this.setBody(new _body2.default(content, contentType));
    }

    /**
     * Get Request content
     * @returns {string}
     */

  }, {
    key: 'getContent',
    value: function getContent() {
      return this.getBody().getContent();
    }

    /**
     * Create an instance of Request from a specific resource
     * @param {!Object} resource Original resource, it should be an instance of http.IncomingMessage
     * @returns {Request}
     */

  }], [{
    key: 'from',
    value: function from(resource) {
      if (resource === null || (typeof resource === 'undefined' ? 'undefined' : _typeof(resource)) !== 'object') {
        throw new Error('The resource of request must be an object.');
      }

      var request = new Request();
      this._setUpMethod(request, resource);
      this._setUpHeader(request, resource);
      this._setUpUri(request, resource);
      this._setUpServer(request, resource);
      this._setUpClient(request, resource);

      return request;
    }

    /**
     * Set up header from resource
     * @param {!Request} request
     * @param {!Object} resource
     * @private
     */

  }, {
    key: '_setUpHeader',
    value: function _setUpHeader(request, resource) {
      if (resource.rawHeaders !== undefined) {
        for (var i = 0; i < resource.rawHeaders.length; i++) {
          request.getHeader().set(resource.rawHeaders[i], resource.rawHeaders[++i]);
        }
      }
    }

    /**
     * Setup URI from resource's url
     * @param {!Request} request
     * @param {!Object} resource
     * @private
     */

  }, {
    key: '_setUpUri',
    value: function _setUpUri(request, resource) {
      if (resource.url !== undefined) {
        request.setUri('http://' + request.getHeader().get(_header2.default.HOST) + resource.url);
      }
    }

    /**
     * Set up method of request
     * @param {!Request} request
     * @param {!Object} resource
     * @private
     */

  }, {
    key: '_setUpMethod',
    value: function _setUpMethod(request, resource) {
      if (resource.method !== undefined) {
        request.setMethod(resource.method);
      }
    }

    /**
     * Set up information about request's server
     * @param {!Request} request
     * @param {!Object} resource
     * @private
     */

  }, {
    key: '_setUpServer',
    value: function _setUpServer(request, resource) {
      if (resource.connection !== undefined) {
        var connection = resource.connection;
        request.getServer().set(Request.SERVER_HOST, connection.address().address);
        request.getServer().set(Request.SERVER_PORT, connection.address().port);
        request.getServer().set(Request.ADDRESS_FAMILY, connection.address().family);
        request.getServer().set(Request.LOCAL_HOST, connection.localAddress);
        request.getServer().set(Request.LOCAL_PORT, connection.localPort);
      }
    }

    /**
     * Set up information about request's client source
     * @param {!Request} request
     * @param {!Object} resource
     * @private
     */

  }, {
    key: '_setUpClient',
    value: function _setUpClient(request, resource) {
      if (resource.connection !== undefined) {
        var connection = resource.connection;
        request.getClient().set(Request.CLIENT_HOST, connection.remoteAddress);
        request.getClient().set(Request.CLIENT_PORT, connection.remotePort);
        request.getClient().set(Request.ADDRESS_FAMILY, connection.remoteFamily);
      }
    }
  }]);

  return Request;
}(_message2.default);

exports.default = Request;

Request.METHOD_GET = 'GET';
Request.METHOD_POST = 'POST';
Request.METHOD_PUT = 'PUT';
Request.METHOD_PATCH = 'PATCH';
Request.METHOD_DELETE = 'DELETE';
Request.METHOD_HEAD = 'HEAD';
Request.METHOD_OPTION = 'OPTION';

Request.DEFAULT_METHOD = 'GET';
Request.DEFAULT_PATH = '/';

Request.ADDRESS_FAMILY = 'family';
Request.ADDRESS_HOST = 'host';
Request.ADDRESS_PORT = 'port';
Request.SERVER_HOST = Request.ADDRESS_HOST;
Request.SERVER_PORT = Request.ADDRESS_PORT;
Request.CLIENT_HOST = Request.ADDRESS_HOST;
Request.CLIENT_PORT = Request.ADDRESS_PORT;
Request.LOCAL_HOST = Request.ADDRESS_HOST;
Request.LOCAL_PORT = Request.ADDRESS_PORT;
Request.URI_PROTOCOL = 'protocol';
Request.URI_HOST = 'host';
Request.URI_PORT = 'port';
Request.URI_PATH = 'path';
Request.URI_HASH = 'hash';
Request.URI_HREF = 'href';
Request.URI_SEARCH = 'search';
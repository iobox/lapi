'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('../http/request');

var _request2 = _interopRequireDefault(_request);

var _response = require('../http/response');

var _response2 = _interopRequireDefault(_response);

var _header = require('../http/header');

var _header2 = _interopRequireDefault(_header);

var _body = require('../http/body');

var _body2 = _interopRequireDefault(_body);

var _base = require('../util/base');

var _base2 = _interopRequireDefault(_base);

var _spec = require('./spec');

var _spec2 = _interopRequireDefault(_spec);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');

var Api = function () {
  function Api() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Api);

    this._default = {
      port: 7777,
      host: '127.0.0.1',
      timeout: 180000 // 180 seconds
    };
    this._options = Object.assign(this._default, options);
  }

  /**
   * Make an API call
   * @param {Request} request
   * @returns {Executor}
   */


  _createClass(Api, [{
    key: 'call',
    value: function call(request) {
      if (!(request instanceof _request2.default)) {
        throw new _invalidArgument2.default('[test.Api#call] request must be an instance of Request');
      }

      return new Executor(request, this._options);
    }

    /**
     * GET request
     * @param {string} uri
     * @param {Object} query
     * @param {Object} header
     * @returns {Executor}
     */

  }, {
    key: 'get',
    value: function get(uri) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.call(this._makeRequest(_request2.default.METHOD_GET, uri, query, {}, header));
    }

    /**
     * POST request
     * @param {string} uri
     * @param {Object} content
     * @param {Object} header
     * @returns {Executor}
     */

  }, {
    key: 'post',
    value: function post(uri) {
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.call(this._makeRequest(_request2.default.METHOD_POST, uri, {}, content, header));
    }

    /**
     * PUT request
     * @param {string} uri
     * @param {Object} content
     * @param {Object} header
     * @returns {Executor}
     */

  }, {
    key: 'put',
    value: function put(uri) {
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.call(this._makeRequest(_request2.default.METHOD_PUT, uri, {}, content, header));
    }

    /**
     * PATCH request
     * @param {string} uri
     * @param {Object} content
     * @param {Object} header
     * @returns {Executor}
     */

  }, {
    key: 'patch',
    value: function patch(uri) {
      var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      return this.call(this._makeRequest(_request2.default.METHOD_PATCH, uri, {}, content, header));
    }

    /**
     * DELETE request
     * @param {string} uri
     * @param {Object} header
     * @returns {Executor}
     */

  }, {
    key: 'delete',
    value: function _delete(uri) {
      var header = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.call(this._makeRequest(_request2.default.METHOD_DELETE, uri, {}, {}, header));
    }

    /**
     * Make a request instance
     * @param method
     * @param uri
     * @param query
     * @param content
     * @param header
     * @returns {Request}
     * @private
     */

  }, {
    key: '_makeRequest',
    value: function _makeRequest(method, uri) {
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var content = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var header = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      var request = new _request2.default();
      request.setMethod(method);
      request.setUri(uri);
      request.setQuery(query);
      request.setContent(content);

      request.setHeader(header);
      if (!request.getHeader().has(_header2.default.CONTENT_TYPE)) {
        request.getHeader().set(_header2.default.CONTENT_TYPE, _body2.default.CONTENT_JSON);
      }

      return request;
    }
  }]);

  return Api;
}();

exports.default = Api;

Api.Spec = _spec2.default;

var Executor = function () {
  /**
   * Constructor
   * @param {Request} request
   * @param {Object} [options={}]
   */
  function Executor(request) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Executor);

    this._request = request;
    this._options = options;
    this._attributes = null;
    this._resolve = null;
    this._reject = null;
    this._done = null;
  }

  /**
   * Add attributes
   * @param {Object} attributes
   * @returns {Executor}
   */


  _createClass(Executor, [{
    key: 'with',
    value: function _with(attributes) {
      this._attributes = attributes;
      return this;
    }

    /**
     * Add callback to be executed for every requests
     * @param resolve
     * @returns {Executor}
     */

  }, {
    key: 'then',
    value: function then(resolve) {
      var _this = this;

      this._resolve = resolve;

      this.execute().catch(function (e) {
        return _this._reject(e);
      });

      return this;
    }

    /**
     * Add callback which is called whenever there is an error
     * @param reject
     * @returns {Executor}
     */

  }, {
    key: 'catch',
    value: function _catch(reject) {
      this._reject = reject;
      return this;
    }

    /**
     * Add callback which is run when every thing has been done
     * @param {Function} done
     * @returns {Executor}
     */

  }, {
    key: 'done',
    value: function done(_done) {
      this._done = _done;
      return this;
    }

    /**
     * Execute an API call
     * @returns {Promise}
     */

  }, {
    key: 'execute',
    value: function execute() {
      if (this._attributes === null) {
        return this._executeOne(this._request);
      } else {
        return this._executeMany(this._request);
      }
    }

    /**
     * Execute single request
     * @param {Request} request
     * @param {Object} [attributes={}]
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_executeOne',
    value: function _executeOne(request) {
      var _this2 = this;

      var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var spec = new Api.Spec();
      spec.setRequest(request);
      spec.setAttributes(attributes);
      spec.setUp();

      return new Promise(function (resolve, reject) {
        var request = spec.getRequest();
        var options = Object.assign({}, _this2._options);
        options.method = request.getMethod();
        options.path = request.getPath();
        options.headers = request.getHeader().all();

        var req = http.request(options, function (res) {
          _response2.default.from(res).then(function (response) {
            spec.setResponse(response);
            spec.tearDown();
            resolve(spec);
          });
        });

        req.on('error', function (e) {
          return reject(e);
        });
        if (request.getMethod() !== _request2.default.METHOD_GET && request.getContent() !== '') {
          req.write(request.getContent());
        }
        req.end();
      }).then(function (spec) {
        return _this2._resolve(spec);
      });
    }

    /**
     * Execute multiple requests
     * @param {Request} request
     * @returns {Promise}
     * @private
     */

  }, {
    key: '_executeMany',
    value: function _executeMany(request) {
      var _this3 = this;

      var keys = Object.keys(this._attributes);
      if (!Array.isArray(this._attributes[keys[0]])) {
        throw new _invalidArgument2.default('[test.Api#_executeMany] first attribute must be an array');
      }

      var attributes = void 0,
          tasks = [];
      for (var i = 0; i < this._attributes[keys[0]].length; i++) {
        attributes = {};
        for (var j = 0; j < keys.length; j++) {
          attributes[keys[j]] = this._attributes[keys[j]][i];
        }
        tasks.push(this._executeOne(_base2.default.from(request).clone(), attributes));
      }

      return Promise.all(tasks).then(function (results) {
        _this3._done(results);
      });
    }
  }]);

  return Executor;
}();
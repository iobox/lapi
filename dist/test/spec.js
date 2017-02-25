'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _request = require('../http/request');

var _request2 = _interopRequireDefault(_request);

var _response = require('../http/response');

var _response2 = _interopRequireDefault(_response);

var _base = require('../util/base');

var _base2 = _interopRequireDefault(_base);

var _header = require('./spec/header');

var _header2 = _interopRequireDefault(_header);

var _body = require('./spec/body');

var _body2 = _interopRequireDefault(_body);

var _http = require('./spec/http');

var _http2 = _interopRequireDefault(_http);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spec = function () {
  function Spec() {
    var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var response = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Spec);

    this._request = request;
    this._response = response;
    this._attributes = new _bag2.default();

    _base2.default.from(this).uses([_header2.default], [_body2.default], [_http2.default]);
  }

  /**
   * Get request
   * @returns {Request}
   */


  _createClass(Spec, [{
    key: 'getRequest',
    value: function getRequest() {
      return this._request;
    }

    /**
     * Set request
     * @param {Request} request
     */

  }, {
    key: 'setRequest',
    value: function setRequest(request) {
      if (request instanceof _request2.default) {
        this._request = request;
      } else {
        throw new _invalidArgument2.default('[test.Spec#setRequest] request must be an instance of Request');
      }
    }

    /**
     * Get response
     * @returns {Response}
     */

  }, {
    key: 'getResponse',
    value: function getResponse() {
      return this._response;
    }

    /**
     * Set response
     * @param {Response} response
     */

  }, {
    key: 'setResponse',
    value: function setResponse(response) {
      if (response instanceof _response2.default) {
        this._response = response;
      } else {
        throw new _invalidArgument2.default('[test.Spec#setResponse] response must be an instance of Response');
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
     * Set and replace attributes
     * @param {Bag|Object} attributes
     */

  }, {
    key: 'setAttributes',
    value: function setAttributes(attributes) {
      if (attributes instanceof _bag2.default) {
        this._attributes = attributes;
      } else if ((typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object') {
        this._attributes = new _bag2.default(attributes);
      } else {
        throw new _invalidArgument2.default('[test.Spec#with] attributes must be either an object or an instance of Bag');
      }
    }

    /**
     * Set and replace attributes
     * Alias of setAttributes
     * @see setAttributes
     * @param {Bag|Object} attributes
     */

  }, {
    key: 'with',
    value: function _with(attributes) {
      this.setAttributes(attributes);
    }

    /**
     * Get value of an attribute
     * @param {string} attribute Name of attribute to get
     * @param {*} [def=null] Default value to return in case attribute could not be found
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(attribute) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return this.getAttributes().get(attribute, def);
    }

    /**
     * Set value of an attribute
     * @param {string} attribute Name of attribute to set
     * @param {*} value Value of attribute
     */

  }, {
    key: 'set',
    value: function set(attribute, value) {
      this.getAttributes().set(attribute, value);
    }

    /**
     * Set up spec
     *
     * In order to extend this method, super method must be called first
     */

  }, {
    key: 'setUp',
    value: function setUp() {
      var matches = void 0,
          content = this.getRequest().getBody().getParsedContent();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = content[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          matches = value.match(/^<(\w+)>$/i);
          if (typeof value === 'string' && matches) {
            content.set(key, this.get(matches[1]));
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

      this.getRequest().setContent(content.all());
    }

    /**
     * Clean up spec
     */

  }, {
    key: 'tearDown',
    value: function tearDown() {}
  }]);

  return Spec;
}();

exports.default = Spec;
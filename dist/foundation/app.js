'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('./bag');

var _bag2 = _interopRequireDefault(_bag);

var _containerAware = require('../di/container-aware');

var _containerAware2 = _interopRequireDefault(_containerAware);

var _container = require('../di/container');

var _container2 = _interopRequireDefault(_container);

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

var _request = require('../http/request');

var _request2 = _interopRequireDefault(_request);

var _route = require('../http/routing/route');

var _route2 = _interopRequireDefault(_route);

var _module = require('./extension/module');

var _module2 = _interopRequireDefault(_module);

var _manager = require('./extension/manager');

var _manager2 = _interopRequireDefault(_manager);

var _extension = require('./extension/extension');

var _extension2 = _interopRequireDefault(_extension);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_ContainerAware) {
  _inherits(App, _ContainerAware);

  /**
   * Constructor
   * @param {Container} [container=null]
   */
  function App() {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, App);

    /**
     * Internal Extension Manager
     * @type {ExtensionManager}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, container));

    _this._extensionManager = new _manager2.default();
    return _this;
  }

  /**
   * Get Extension Manager
   * @returns {ExtensionManager}
   */


  _createClass(App, [{
    key: 'getExtensionManager',
    value: function getExtensionManager() {
      return this._extensionManager;
    }

    /**
     * Set Extension Manager
     * @param {!ExtensionManager} extensionManager
     */

  }, {
    key: 'setExtensionManager',
    value: function setExtensionManager(extensionManager) {
      this._extensionManager = extensionManager;
    }

    /**
     * Get application's optional configuration
     * @returns {Bag}
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.getContainer().get('app.options');
    }

    /**
     * Set application's options
     * @param {Object|Bag} options
     * @throws {InvalidArgumentException} throws an exception when input argument is not an instance of Bag or an object
     */

  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      if (options instanceof _bag2.default) {
        this.getContainer().set('app.options', options);
      } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        this.getContainer().set('app.options', new _bag2.default(options));
      } else {
        throw new _invalidArgument2.default('[Foundation/App#setOptions] options must be either an object or an instance of Bag');
      }
    }

    /**
     * Extend application with extension
     * @param {Extension} extension
     */

  }, {
    key: 'extend',
    value: function extend(extension) {
      this.getExtensionManager().extend(extension);
    }

    /**
     * Run application
     * @param {Bag|Object} [options=null] Optional configuration for application
     */

  }, {
    key: 'run',
    value: function run() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.setOptions(options || new _bag2.default());

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.getExtensionManager().getExtensions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var extension = _step.value;

          if (extension instanceof _extension2.default) {
            extension.setContainer(this.getContainer());
          }
          if (extension instanceof _module2.default) {
            extension.setUp();
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
    }

    /**
     * Quick add API route
     * @param {!string} method
     * @param {string} path
     * @param {?Object} [requirements=null]
     * @param {?Function|Object} [callback=null]
     */

  }, {
    key: 'api',
    value: function api(method, path) {
      var requirements = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var route = new _route2.default();
      route.setMethods([method]);
      route.setPath(path);
      route.setRequirements(requirements || {});
      if (typeof callback === 'function') {
        route.setOptions({
          controller: new _controller2.default(),
          action: callback
        });
      } else if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object') {
        route.setOptions(callback);
      } else {
        throw new _invalidArgument2.default('[Foundation/App#api] callback must be either an object or a function');
      }

      var name = '' + method + path;
      route.setName(name.replace(/\W+/g, '_'));
      this.getContainer().get('http.router').add(route);
    }

    /**
     * HTTP GET
     * @param {string} path
     * @param {?Object} [requirements=null]
     * @param {?Function} [callback=null]
     */

  }, {
    key: 'get',
    value: function get(path) {
      var requirements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.api(_request2.default.METHOD_GET, path, requirements, callback);
    }

    /**
     * HTTP POST
     * @param {string} path
     * @param {?Object} [requirements=null]
     * @param {?Function} [callback=null]
     */

  }, {
    key: 'post',
    value: function post(path) {
      var requirements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.api(_request2.default.METHOD_POST, path, requirements, callback);
    }

    /**
     * HTTP PUT
     * @param {string} path
     * @param {?Object} [requirements=null]
     * @param {?Function} [callback=null]
     */

  }, {
    key: 'put',
    value: function put(path) {
      var requirements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.api(_request2.default.METHOD_PUT, path, requirements, callback);
    }

    /**
     * HTTP PATCH
     * @param {string} path
     * @param {?Object} [requirements=null]
     * @param {?Function} [callback=null]
     */

  }, {
    key: 'patch',
    value: function patch(path) {
      var requirements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.api(_request2.default.METHOD_PATCH, path, requirements, callback);
    }

    /**
     * HTTP DELETE
     * @param {string} path
     * @param {?Object} [requirements=null]
     * @param {?Function} [callback=null]
     */

  }, {
    key: 'delete',
    value: function _delete(path) {
      var requirements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      this.api(_request2.default.METHOD_DELETE, path, requirements, callback);
    }
  }]);

  return App;
}(_containerAware2.default);

exports.default = App;
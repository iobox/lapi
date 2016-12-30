'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bag = require('./bag');

var _bag2 = _interopRequireDefault(_bag);

var _kernel = require('./kernel');

var _kernel2 = _interopRequireDefault(_kernel);

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

var _module = require('./extension/module');

var _module2 = _interopRequireDefault(_module);

var _manager = require('./extension/manager');

var _manager2 = _interopRequireDefault(_manager);

var _container3 = require('./extension/container');

var _container4 = _interopRequireDefault(_container3);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Kernel) {
  _inherits(App, _Kernel);

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
      return this._options;
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
        this._options = options;
      } else if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
        this._options = new _bag2.default(options);
      } else {
        throw new _invalidArgument2.default('[Foundation/App#setOptions] options must be either an object or an instance of Bag');
      }
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

          if (extension instanceof _container4.default) {
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
  }]);

  return App;
}(_kernel2.default);

exports.default = App;
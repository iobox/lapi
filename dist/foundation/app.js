'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _kernel = require('./kernel');

var _kernel2 = _interopRequireDefault(_kernel);

var _manager = require('./extension/manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Kernel) {
  _inherits(App, _Kernel);

  function App(container) {
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
  }]);

  return App;
}(_kernel2.default);

exports.default = App;
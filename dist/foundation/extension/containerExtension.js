'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

var _container = require('../container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContainerExtension = function (_ExtensionInterface) {
  _inherits(ContainerExtension, _ExtensionInterface);

  function ContainerExtension() {
    _classCallCheck(this, ContainerExtension);

    /**
     * Shared Container
     * @type {Container}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (ContainerExtension.__proto__ || Object.getPrototypeOf(ContainerExtension)).call(this));

    _this._container = new _container2.default();
    return _this;
  }

  /**
   * Get Container
   * @returns {Container}
   */


  _createClass(ContainerExtension, [{
    key: 'getContainer',
    value: function getContainer() {
      return this._container;
    }

    /**
     * Set Container
     * @param {!Container} container
     */

  }, {
    key: 'setContainer',
    value: function setContainer(container) {
      this._container = container;
    }
  }]);

  return ContainerExtension;
}(_interface2.default);

exports.default = ContainerExtension;
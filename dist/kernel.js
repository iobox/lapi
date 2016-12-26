'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kernel = function () {
  function Kernel(container) {
    _classCallCheck(this, Kernel);

    if (container === undefined) {
      container = new _container2.default();
    }
    this.setContainer(container);
  }

  /**
   * Get container
   * @returns {Container}
   */


  _createClass(Kernel, [{
    key: 'getContainer',
    value: function getContainer() {
      return this._container;
    }

    /**
     * Set container
     * @param {!Container} container
     */

  }, {
    key: 'setContainer',
    value: function setContainer(container) {
      this._container = container;
    }
  }]);

  return Kernel;
}();

exports.default = Kernel;
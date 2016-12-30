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
  /**
   * Constructor
   * @param {Container} [container=null]
   */
  function Kernel() {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, Kernel);

    if (container === null) {
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
      if (container instanceof _container2.default) {
        this._container = container;
      } else {
        throw new Error('[Foundation/Kernel#setContainer] An instance of Container is required');
      }
    }

    /**
     * Determine if abstract is registered
     * @param {string} abstract
     * @returns {boolean}
     */

  }, {
    key: 'has',
    value: function has(abstract) {
      return this.getContainer().has(abstract);
    }

    /**
     * Get a concrete of specific abstract
     * @param {string} abstract
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(abstract) {
      if (!this.has(abstract)) {
        throw new Error('[Foundation/Kernel#get] ' + abstract + ' is not registered');
      }

      return this.getContainer().get(abstract);
    }

    /**
     * Set a concrete to be an implementation of abstract
     * @param {string} abstract
     * @param {?*} concrete
     */

  }, {
    key: 'set',
    value: function set(abstract, concrete) {
      this.getContainer().set(abstract, concrete);
    }
  }]);

  return Kernel;
}();

exports.default = Kernel;
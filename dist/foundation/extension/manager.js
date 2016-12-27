'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExtensionManager = function () {
  function ExtensionManager() {
    _classCallCheck(this, ExtensionManager);

    /**
     * Available extensions
     * @type {Array}
     * @private
     */
    this._extensions = [];
  }

  /**
   * Return all extensions
   * @returns {ExtensionInterface[]}
   */


  _createClass(ExtensionManager, [{
    key: 'getExtensions',
    value: function getExtensions() {
      return this._extensions;
    }

    /**
     * Set and replace all extensions
     * @param {ExtensionInterface[]} extensions
     * @throws {Error} throw an Error if extensions is not an Array
     */

  }, {
    key: 'setExtensions',
    value: function setExtensions(extensions) {
      if (Array.isArray(extensions)) {
        this._extensions = extensions;
      } else {
        throw new Error('[Foundation/Extension/Manager#setExtensions] extensions must be an Array');
      }
    }

    /**
     * Extend QueryManager with an extension
     * @param {ExtensionInterface} extension
     * @throws {Error} throw an Error if extension is not an instance of ExtensionInterface
     */

  }, {
    key: 'extend',
    value: function extend(extension) {
      if (extension instanceof _interface2.default) {
        this._extensions.push(extension);
      } else {
        throw new Error('[Foundation/Extension/Manager#extend] extension must be an instance of Foundation/Extension/Interface');
      }
    }
  }]);

  return ExtensionManager;
}();

exports.default = ExtensionManager;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @interface
 */
var ExtensionInterface = function () {
  function ExtensionInterface() {
    _classCallCheck(this, ExtensionInterface);
  }

  _createClass(ExtensionInterface, [{
    key: 'getName',

    /**
     * @returns {string}
     */
    value: function getName() {
      throw new Error('[Foundation/Extension/Interface#getName] getName must be implemented');
    }
  }]);

  return ExtensionInterface;
}();

exports.default = ExtensionInterface;
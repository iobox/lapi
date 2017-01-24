'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Exception = function () {
  /**
   * Constructor
   * @param {string} [message='']
   * @param {?(number|string)} [code=null]
   */
  function Exception() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Exception);

    this.setMessage(message);
    this.setCode(code);
  }

  /**
   * Get Exception's message
   * @returns {string}
   */


  _createClass(Exception, [{
    key: 'getMessage',
    value: function getMessage() {
      return this._message;
    }

    /**
     * Set Exception's message
     * @param {string} message
     */

  }, {
    key: 'setMessage',
    value: function setMessage(message) {
      this._message = message;
    }

    /**
     * Get Exception's code
     * @returns {?(number|string)}
     */

  }, {
    key: 'getCode',
    value: function getCode() {
      return this._code;
    }

    /**
     * Set Exception's code
     * @param {?(number|string)} code
     */

  }, {
    key: 'setCode',
    value: function setCode(code) {
      this._code = code;
    }
  }]);

  return Exception;
}();

exports.default = Exception;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @interface
 */
var LoggerInterface = function () {
  function LoggerInterface() {
    _classCallCheck(this, LoggerInterface);
  }

  _createClass(LoggerInterface, [{
    key: 'write',

    /**
     * Write a message
     * @param {string} [type='info']
     * @param {string} [message='']
     * @param {Array} [traces=[]]
     */
    value: function write() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LoggerInterface.TYPE_INFO;
      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var traces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    }
  }]);

  return LoggerInterface;
}();

exports.default = LoggerInterface;

LoggerInterface.TYPE_ERROR = 'error';
LoggerInterface.TYPE_INFO = 'info';
LoggerInterface.TYPE_WARNING = 'warning';
LoggerInterface.TYPE_DEBUG = 'debug';
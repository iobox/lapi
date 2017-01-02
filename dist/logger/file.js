'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _interface = require('./interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fs = require('fs');

var FileLogger = function (_LoggerInterface) {
  _inherits(FileLogger, _LoggerInterface);

  function FileLogger() {
    var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, FileLogger);

    var _this = _possibleConstructorReturn(this, (FileLogger.__proto__ || Object.getPrototypeOf(FileLogger)).call(this));

    _this.setPath(path);
    return _this;
  }

  /**
   * Get path
   * @returns {string}
   */


  _createClass(FileLogger, [{
    key: 'getPath',
    value: function getPath() {
      return this._path;
    }

    /**
     * Set path
     * @param {string} path
     */

  }, {
    key: 'setPath',
    value: function setPath(path) {
      this._path = path;
    }
  }, {
    key: 'write',
    value: function write() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _interface2.default.TYPE_INFO;

      var _this2 = this;

      var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var traces = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      var options = { encoding: 'utf8', flag: 'a' };
      var now = new Date();
      if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
        if (typeof message['toString'] === 'function') {
          message = message.toString();
        } else {
          try {
            message = JSON.stringify(message);
          } catch (e) {
            message = '';
          }
        }
      }
      message = '[' + now.toJSON() + '] [' + type + '] ' + message + '\n';
      fs.writeFileSync(this.getPath(), message, options);
      traces.forEach(function (line) {
        fs.writeFileSync(_this2.getPath(), '[' + now.toJSON() + '] ' + line + '\n', options);
      });
    }
  }]);

  return FileLogger;
}(_interface2.default);

exports.default = FileLogger;
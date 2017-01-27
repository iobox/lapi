'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extension = require('../extension');

var _extension2 = _interopRequireDefault(_extension);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModuleExtension = function (_Extension) {
  _inherits(ModuleExtension, _Extension);

  function ModuleExtension() {
    _classCallCheck(this, ModuleExtension);

    return _possibleConstructorReturn(this, (ModuleExtension.__proto__ || Object.getPrototypeOf(ModuleExtension)).apply(this, arguments));
  }

  _createClass(ModuleExtension, [{
    key: 'getName',
    value: function getName() {
      return 'foundation.extension.module';
    }

    /**
     * This method is called for setting up module.
     * Therefore, it could be used to listen application's events.
     * At this stage, the module would already receive application's container.
     */

  }, {
    key: 'setUp',
    value: function setUp() {}

    /**
     * This method is called when outgoing response is sent,
     * and application is going to close connection.
     * It is useful for do some shutdown actions, such as closing database connection.
     */

  }, {
    key: 'tearDown',
    value: function tearDown() {}
  }]);

  return ModuleExtension;
}(_extension2.default);

exports.default = ModuleExtension;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _app = require('./foundation/app');

var _app2 = _interopRequireDefault(_app);

var _system = require('./foundation/extension/system');

var _system2 = _interopRequireDefault(_system);

var _controller = require('./foundation/controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var app = new _app2.default();
app.extend(new _system2.default());
var options = {
  'server.port': 8080,
  'logger.driver': 'file',
  'logger.options': './logs.txt'
};
app.run(options);

var MyController = function (_Controller) {
  _inherits(MyController, _Controller);

  function MyController() {
    _classCallCheck(this, MyController);

    return _possibleConstructorReturn(this, (MyController.__proto__ || Object.getPrototypeOf(MyController)).apply(this, arguments));
  }

  _createClass(MyController, [{
    key: 'getUserAction',
    value: function getUserAction() {
      return {
        user: this.getRequest().get('user'),
        email: this.getRequest().get('email')
      };
    }
  }]);

  return MyController;
}(_controller2.default);

app.get('/hello/{user}', null, function (request) {
  return {
    message: 'Hello ' + request.get('user') + '!'
  };
});
app.put('/hello', null, function (request) {
  return request.getBody().getParsedContent().all();
});
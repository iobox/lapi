'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _console = require('./logger/console');

var _console2 = _interopRequireDefault(_console);

var _json = require('./http/response/json');

var _json2 = _interopRequireDefault(_json);

var _controller = require('./http/controller');

var _controller2 = _interopRequireDefault(_controller);

var _module = require('./foundation/extension/module');

var _module2 = _interopRequireDefault(_module);

var _interface = require('./logger/interface');

var _interface2 = _interopRequireDefault(_interface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlogExtension = function (_ModuleExtension) {
  _inherits(BlogExtension, _ModuleExtension);

  function BlogExtension() {
    _classCallCheck(this, BlogExtension);

    return _possibleConstructorReturn(this, (BlogExtension.__proto__ || Object.getPrototypeOf(BlogExtension)).apply(this, arguments));
  }

  _createClass(BlogExtension, [{
    key: 'getName',
    value: function getName() {
      return 'module.blog';
    }
  }, {
    key: 'setUp',
    value: function setUp() {
      var events = this.getContainer().get('foundation.app.events');
      events.on('http.server.ready', function (args, next) {
        console.log('Blog extension is ready!');
        next();
      });
    }
  }]);

  return BlogExtension;
}(_module2.default);

var app = new _app2.default(),
    container = app.getContainer();
app.extend(new BlogExtension());
app.start({
  'server.port': 8080
}).then(function () {
  app.getLogger().write(_interface2.default.TYPE_INFO, 'Application has been started successfully.');
}).catch(function (e) {
  app.getLogger().write(_interface2.default.TYPE_ERROR, e.message);
});
container.set('foundation.app.logger', new _console2.default());

app.use('auth', function (route, request) {
  return new _json2.default({
    error: "Authentication is required"
  });
});

var BlogController = function (_Controller) {
  _inherits(BlogController, _Controller);

  function BlogController() {
    _classCallCheck(this, BlogController);

    return _possibleConstructorReturn(this, (BlogController.__proto__ || Object.getPrototypeOf(BlogController)).apply(this, arguments));
  }

  _createClass(BlogController, [{
    key: 'getItemAction',
    value: function getItemAction() {
      return {
        data: {
          id: 1,
          title: "Some blog title"
        }
      };
    }
  }]);

  return BlogController;
}(_controller2.default);

var router = app.getRouter();
router.get('/hello/world').handler(function () {
  return {
    data: {
      say: "Hello World!",
      isAuthenticated: this.getRequest().get('isAuthenticated')
    }
  };
}).middleware(['auth']);
router.group(function () {
  this.get('/users/{id}').require({ id: /\d+/ }).handler(function (request) {
    return {
      data: {
        id: request.get('id'),
        name: "Long Do"
      }
    };
  }).middleware(['isMale']);
}).prefix('/v1').middleware(['v1']);
router.get('/blogs/{id}').require({ id: /\d+/ }).handler(new BlogController(), 'getItemAction');
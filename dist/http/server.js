'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

var _bag = require('../bag');

var _bag2 = _interopRequireDefault(_bag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var http = require('http');
var os = require('os');

var Server = function () {
  function Server() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Server);

    this.options = new _bag2.default(options);
    this.server = null;
    this.request = null;
    this.response = null;
  }

  _createClass(Server, [{
    key: 'start',
    value: function start(cb) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var port = _this.options.get(Server.OPTION_PORT, Server.DEFAULT_PORT),
            host = _this.options.get(Server.OPTION_HOST, Server.DEFAULT_HOST),
            backlog = _this.options.get(Server.OPTION_BACKLOG, Server.DEFAULT_BACKLOG);
        _this.info = {
          host: host,
          port: port,
          backlog: backlog,
          url: 'http://' + (host === null ? os.hostname() : host) + ':' + port
        };
        _this.server = http.createServer(function (req, res) {
          Promise.all([_request2.default.from(req), _response2.default.from(res)]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var request = _ref2[0];
            var response = _ref2[1];

            resolve(request, response);
          }).catch(function (e) {
            reject(e);
          });
        }).listen(port, host, backlog, cb);
      });
    }
  }]);

  return Server;
}();

exports.default = Server;

Server.DEFAULT_BACKLOG = 511;
Server.DEFAULT_PORT = 3000;
Server.DEFAULT_HOST = null;
Server.OPTION_PORT = 'port';
Server.OPTION_HOST = 'host';
Server.OPTION_BACKLOG = 'backlog';
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _request = require('../request');

var _request2 = _interopRequireDefault(_request);

var _bag = require('../../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _controller = require('../controller');

var _controller2 = _interopRequireDefault(_controller);

var _invalidArgument = require('../../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupRoute = function () {
  function GroupRoute() {
    _classCallCheck(this, GroupRoute);
  }

  _createClass(GroupRoute, [{
    key: 'contructor',
    value: function contructor(routes) {
      this._routes = routes;
      this._prefix = null;
      this._host = null;
      this._port = null;
      this._middlewares = null;
    }
  }, {
    key: 'execute',
    value: function execute() {
      var _this = this;

      if (!Array.isArray(this._routes) || !this._routes.length) {
        return [];
      }
      this._routes.forEach(function (route) {
        if (!(route instanceof _route2.default)) {
          return false;
        }
        if (_this._prefix !== null) {
          route.setPath('' + _this._prefix + route.getPath());
        }
        if (_this._host !== null) {
          route.setHost(_this._host);
        }
        if (_this._port !== null) {
          route.setPort(_this._port);
        }
        if (Array.isArray(_this._middlewares) && _this._middlewares.length) {
          route.setMiddlewares(route.getMiddlewares().concat(_this._middlewares));
        }
      });
      return this._routes;
    }
  }, {
    key: 'has',
    value: function has(name) {
      for (var i = 0; i < this._routes.length; i++) {
        if (this._routes[i].getName() === name) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: 'prefix',
    value: function prefix(_prefix) {
      this._prefix = _prefix;
    }
  }, {
    key: 'host',
    value: function host(_host) {
      this._host = _host;
    }
  }, {
    key: 'port',
    value: function port(_port) {
      this._port = _port;
    }
  }, {
    key: 'middleware',
    value: function middleware(midlewares) {
      this._middlewares = midlewares;
    }
  }]);

  return GroupRoute;
}();

/**
 * Router
 *
 * Manage and route request
 */


var Router = function () {
  /**
   * Constructor
   */
  function Router() {
    _classCallCheck(this, Router);

    this._routes = [];
    this._groups = [];
  }

  _createClass(Router, [{
    key: 'has',
    value: function has(name) {
      if (this._groups.length) {
        for (var i = 0; i < this._groups.length; i++) {
          if (this._groups[i].has(name)) {
            return true;
          }
        }
      }
      for (var _i = 0; _i < this._routes.length; _i++) {
        if (this._routes[_i].getName() === name) {
          return true;
        }
      }
      return false;
    }

    /**
     * Add a route
     * @param {Object|Route|GroupRoute} route
     * @returns {Route}
     */

  }, {
    key: 'add',
    value: function add(route) {
      if ((typeof route === 'undefined' ? 'undefined' : _typeof(route)) !== 'object') {
        throw new _invalidArgument2.default('[http.routing.Router#add] Route must be either an object or an instance of Route');
      }

      if (route instanceof GroupRoute) {
        this._groups.push(route);
        return route;
      } else if (!(route instanceof _route2.default)) {
        route = _route2.default.from(route);
      }

      var methods = route.getMethods();
      if (!methods.length) {
        throw new _invalidArgument2.default('[http.routing.Route#add] route must have at least one method');
      }

      var path = route.getPath();
      if (path === '' || path === null) {
        throw new _invalidArgument2.default('[http.routing.Route#add] route must define path');
      }

      var name = route.getName();
      if (name === '' || name === null) {
        // To guarantee that route must always have a name
        name = '' + methods[0] + path;
        route.setName(name.replace(/\W+/g, '_'));
      }

      // To make sure that handler always be a controller instance
      var attributes = route.getAttributes(),
          controller = attributes.get('controller'),
          action = attributes.get('action');
      if (action === null && typeof controller === 'function' && !(controller instanceof _controller2.default)) {
        route.handler(new _controller2.default(), controller);
      } else if (controller === null) {
        throw new _invalidArgument2.default('[http.routing.Router#add] controller must be specified');
      }

      this._routes.push(route);
      return route;
    }

    /**
     * Remove a specific route from router
     * @param {string} name
     */

  }, {
    key: 'remove',
    value: function remove(name) {
      for (var i = 0; i < this._routes.length; i++) {
        if (this._routes[i].getName() === name) {
          this._routes.splice(i, 1);
          break;
        }
      }
    }

    /**
     * Route the request to find out the matching route
     * @param {Request} request
     * @returns {Route|null} Return the matched route or null if there is no appropriate routes
     */

  }, {
    key: 'route',
    value: function route(request) {
      var _this2 = this;

      if (!(request instanceof _request2.default)) {
        throw new Error('[http.routing.Router#route] Request must be an instance of http.Request');
      }
      if (this._groups.length) {
        this._groups.forEach(function (group) {
          return group.execute().forEach(function (route) {
            return _this2.add(route);
          });
        });
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var route = _step.value;

          if (route.match(request)) {
            request.setAttributes(Object.assign(route.getAttributes().except(['controller', 'action']), route.getMatches()));
            return route;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }, {
    key: 'get',
    value: function get(path) {
      this.add(new _route2.default(_request2.default.METHOD_GET, path));
    }
  }, {
    key: 'post',
    value: function post(path) {
      return this.add(new _route2.default(_request2.default.METHOD_POST, path));
    }
  }, {
    key: 'put',
    value: function put(path) {
      return this.add(new _route2.default(_request2.default.METHOD_PUT, path));
    }
  }, {
    key: 'patch',
    value: function patch(path) {
      return this.add(new _route2.default(_request2.default.METHOD_PATCH, path));
    }
  }, {
    key: 'delete',
    value: function _delete(path) {
      return this.add(new _route2.default(_request2.default.METHOD_DELETE, path));
    }
  }, {
    key: 'group',
    value: function group(routes) {
      return this.add(new GroupRoute(routes));
    }
  }, {
    key: 'length',
    get: function get() {
      return this._routes.length;
    }
  }]);

  return Router;
}();

exports.default = Router;
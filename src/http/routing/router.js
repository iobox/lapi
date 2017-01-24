import Route from './route'
import Request from '../request'
import Bag from '../../foundation/bag'
import Controller from '../controller'
import InvalidArgumentException from '../../exception/invalid-argument'

class GroupRoute {
  contructor(routes) {
    this._routes = routes
    this._prefix = null
    this._host = null
    this._port = null
    this._middlewares = null
  }

  execute() {
    if (!Array.isArray(this._routes) || !this._routes.length) {
      return []
    }
    this._routes.forEach(route => {
      if (!(route instanceof Route)) {
        return false
      }
      if (this._prefix !== null) {
        route.setPath(`${this._prefix}${route.getPath()}`)
      }
      if (this._host !== null) {
        route.setHost(this._host)
      }
      if (this._port !== null) {
        route.setPort(this._port)
      }
      if (Array.isArray(this._middlewares) && this._middlewares.length) {
        route.setMiddlewares(route.getMiddlewares().concat(this._middlewares))
      }
    })
    return this._routes
  }

  has(name) {
    for (let i = 0; i < this._routes.length; i++) {
      if (this._routes[i].getName() === name) {
        return true
      }
    }

    return false
  }

  prefix(prefix) {
    this._prefix = prefix
  }

  host(host) {
    this._host = host
  }

  port(port) {
    this._port = port
  }

  middleware(midlewares) {
    this._middlewares = midlewares
  }
}

/**
 * Router
 *
 * Manage and route request
 */
export default class Router {
  /**
   * Constructor
   */
  constructor() {
    this._routes = []
    this._groups = []
  }

  get length() {
    return this._routes.length
  }

  has(name) {
    if (this._groups.length) {
      for (let i = 0; i < this._groups.length; i++) {
        if (this._groups[i].has(name)) {
          return true
        }
      }
    }
    for (let i = 0; i < this._routes.length; i++) {
      if (this._routes[i].getName() === name) {
        return true
      }
    }
    return false
  }

  /**
   * Add a route
   * @param {Object|Route|GroupRoute} route
   * @returns {Route}
   */
  add(route) {
    if (typeof route !== 'object') {
      throw new InvalidArgumentException('[http.routing.Router#add] Route must be either an object or an instance of Route')
    }

    if (route instanceof GroupRoute) {
      this._groups.push(route)
      return route
    } else if (!(route instanceof Route)) {
      route = Route.from(route)
    }

    const methods = route.getMethods()
    if (!methods.length) {
      throw new InvalidArgumentException('[http.routing.Route#add] route must have at least one method')
    }

    const path = route.getPath()
    if (path === '' || path === null) {
      throw new InvalidArgumentException('[http.routing.Route#add] route must define path')
    }

    let name = route.getName()
    if (name === '' || name === null) {
      // To guarantee that route must always have a name
      name = `${methods[0]}${path}`
      route.setName(name.replace(/\W+/g, '_'))
    }

    // To make sure that handler always be a controller instance
    const attributes = route.getAttributes(),
          controller = attributes.get('controller'),
          action = attributes.get('action')
    if (action === null
        && typeof controller === 'function' && !(controller instanceof Controller)) {
      route.handler(new Controller(), controller)
    } else if (controller === null) {
      throw new InvalidArgumentException('[http.routing.Router#add] controller must be specified')
    }

    this._routes.push(route)
    return route
  }

  /**
   * Remove a specific route from router
   * @param {string} name
   */
  remove(name) {
    for (let i = 0; i < this._routes.length; i++) {
      if (this._routes[i].getName() === name) {
        this._routes.splice(i, 1)
        break
      }
    }
  }

  /**
   * Route the request to find out the matching route
   * @param {Request} request
   * @returns {Route|null} Return the matched route or null if there is no appropriate routes
   */
  route(request) {
    if (!(request instanceof Request)) {
      throw new Error('[http.routing.Router#route] Request must be an instance of http.Request')
    }
    if (this._groups.length) {
      this._groups.forEach(group => group.execute().forEach(route => this.add(route)))
    }

    for (let route of this._routes) {
      if (route.match(request)) {
        request.setAttributes(Object.assign(route.getAttributes().except(['controller', 'action']), route.getMatches()))
        return route
      }
    }

    return null
  }

  get(path) {
    this.add(new Route(Request.METHOD_GET, path))
  }

  post(path) {
    return this.add(new Route(Request.METHOD_POST, path))
  }

  put(path) {
    return this.add(new Route(Request.METHOD_PUT, path))
  }

  patch(path) {
    return this.add(new Route(Request.METHOD_PATCH, path))
  }

  delete(path) {
    return this.add(new Route(Request.METHOD_DELETE, path))
  }

  group(routes) {
    return this.add(new GroupRoute(routes))
  }
}
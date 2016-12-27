import Route from './route'
import Request from '../request'
import Bag from '../../bag'

/**
 * Router
 *
 * Manage and route request
 */
export default class Router extends Bag {
  /**
   * Constructor
   * @param {Route[]} routes
   */
  constructor(routes = []) {
    super()
    if (routes.length) {
      routes.forEach(route => this.add(route))
    }
  }

  /**
   * Add a route
   * @param {Object|Route} route
   */
  add(route) {
    if (typeof route !== 'object') {
      throw new Error('[Router#add] Route must be either an object or an instance of Route')
    }

    if (!(route instanceof Route)) {
      route = Route.from(route)
    }

    this.set(route.getName(), route)
  }

  /**
   * An alias of delete method
   * @param {string} name
   */
  remove(name) {
    this.delete(name)
  }

  /**
   * Route the request to find out the matching route
   * @param {Request} request
   * @returns {Route|null} Return the matched route or null if there is no appropriate routes
   */
  route(request) {
    if (!(request instanceof Request)) {
      throw new Error('[Router#route] Request must be an instance of Http/Request')
    }

    for (let [name, route] of this.entries()) {
      if (route.match(request)) {
        request.setAttributes(Object.assign(route.getAttributes(), route.getMatches()))
        return route
      }
    }

    return null
  }
}
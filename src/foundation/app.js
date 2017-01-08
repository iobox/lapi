import Bag from './bag'
import ContainerAware from '../di/container-aware'
import Container from '../di/container'
import Controller from './controller'
import Request from '../http/request'
import Route from '../http/routing/route'
import ModuleExtension from './extension/module'
import ExtensionManager from './extension/manager'
import Extension from './extension/extension'
import InvalidArgumentException from '../exception/invalid-argument'

export default class App extends ContainerAware {
  /**
   * Constructor
   * @param {Container} [container=null]
   */
  constructor(container = null) {
    super(container)

    /**
     * Internal Extension Manager
     * @type {ExtensionManager}
     * @private
     */
    this._extensionManager = new ExtensionManager()
  }

  /**
   * Get Extension Manager
   * @returns {ExtensionManager}
   */
  getExtensionManager() {
    return this._extensionManager
  }

  /**
   * Set Extension Manager
   * @param {!ExtensionManager} extensionManager
   */
  setExtensionManager(extensionManager) {
    this._extensionManager = extensionManager
  }

  /**
   * Get application's optional configuration
   * @returns {Bag}
   */
  getOptions() {
    return this.getContainer().get('app.options')
  }

  /**
   * Set application's options
   * @param {Object|Bag} options
   * @throws {InvalidArgumentException} throws an exception when input argument is not an instance of Bag or an object
   */
  setOptions(options) {
    if (options instanceof Bag) {
      this.getContainer().set('app.options', options)
    } else if (typeof options === 'object') {
      this.getContainer().set('app.options', new Bag(options))
    } else {
      throw new InvalidArgumentException('[Foundation/App#setOptions] options must be either an object or an instance of Bag')
    }
  }

  /**
   * Extend application with extension
   * @param {Extension} extension
   */
  extend(extension) {
    this.getExtensionManager().extend(extension)
  }

  /**
   * Run application
   * @param {Bag|Object} [options=null] Optional configuration for application
   */
  run(options = null) {
    this.setOptions(options || new Bag())

    for (let extension of this.getExtensionManager().getExtensions()) {
      if (extension instanceof Extension) {
        extension.setContainer(this.getContainer())
      }
      if (extension instanceof ModuleExtension) {
        extension.setUp()
      }
    }
  }

  /**
   * Quick add API route
   * @param {!string} method
   * @param {string} path
   * @param {?Object} [requirements=null]
   * @param {?Function|Object} [callback=null]
   */
  api(method, path, requirements = null, callback = null) {
    let route = new Route()
    route.setMethods([method])
    route.setPath(path)
    route.setRequirements(requirements || {})
    if (typeof callback === 'function') {
      route.setOptions({
        controller: new Controller(),
        action: callback
      })
    } else if (typeof callback === 'object') {
      route.setOptions(callback)
    } else {
      throw new InvalidArgumentException('[Foundation/App#api] callback must be either an object or a function')
    }

    let name = `${method}${path}`
    route.setName(name.replace(/\W+/g, '_'))
    this.getContainer().get('http.router').add(route)
  }

  /**
   * HTTP GET
   * @param {string} path
   * @param {?Object} [requirements=null]
   * @param {?Function} [callback=null]
   */
  get(path, requirements = null, callback = null) {
    this.api(Request.METHOD_GET, path, requirements, callback)
  }

  /**
   * HTTP POST
   * @param {string} path
   * @param {?Object} [requirements=null]
   * @param {?Function} [callback=null]
   */
  post(path, requirements = null, callback = null) {
    this.api(Request.METHOD_POST, path, requirements, callback)
  }

  /**
   * HTTP PUT
   * @param {string} path
   * @param {?Object} [requirements=null]
   * @param {?Function} [callback=null]
   */
  put(path, requirements = null, callback = null) {
    this.api(Request.METHOD_PUT, path, requirements, callback)
  }

  /**
   * HTTP PATCH
   * @param {string} path
   * @param {?Object} [requirements=null]
   * @param {?Function} [callback=null]
   */
  patch(path, requirements = null, callback = null) {
    this.api(Request.METHOD_PATCH, path, requirements, callback)
  }

  /**
   * HTTP DELETE
   * @param {string} path
   * @param {?Object} [requirements=null]
   * @param {?Function} [callback=null]
   */
  delete(path, requirements = null, callback = null) {
    this.api(Request.METHOD_DELETE, path, requirements, callback)
  }
}
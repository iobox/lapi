import Bag from './bag'
import Kernel from './kernel'
import Container from './container'
import ModuleExtension from './extension/module'
import ExtensionManager from './extension/manager'
import ContainerExtension from './extension/container'
import InvalidArgumentException from '../exception/invalid-argument'

export default class App extends Kernel {
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
    return this._options
  }

  /**
   * Set application's options
   * @param {Object|Bag} options
   * @throws {InvalidArgumentException} throws an exception when input argument is not an instance of Bag or an object
   */
  setOptions(options) {
    if (options instanceof Bag) {
      this._options = options
    } else if (typeof options === 'object') {
      this._options = new Bag(options)
    } else {
      throw new InvalidArgumentException('[Foundation/App#setOptions] options must be either an object or an instance of Bag')
    }
  }

  /**
   * Run application
   * @param {Bag|Object} [options=null] Optional configuration for application
   */
  run(options = null) {
    this.setOptions(options || new Bag())

    for (let extension of this.getExtensionManager().getExtensions()) {
      if (extension instanceof ContainerExtension) {
        extension.setContainer(this.getContainer())
      }
      if (extension instanceof ModuleExtension) {
        extension.setUp()
      }
    }
  }
}

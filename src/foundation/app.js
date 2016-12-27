import Kernel from './kernel'
import ExtensionManager from './extension/manager'

export default class App extends Kernel {
  constructor(container) {
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
}

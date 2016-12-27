import ExtensionInterface from './interface'
import Container from '../container'

export default class ContainerExtension extends ExtensionInterface {
  constructor() {
    super()
    
    /**
     * Shared Container
     * @type {Container}
     * @private
     */
    this._container = new Container()
  }

  /**
   * Get Container
   * @returns {Container}
   */
  getContainer() {
    return this._container
  }

  /**
   * Set Container
   * @param {!Container} container
   */
  setContainer(container) {
    this._container = container
  }
}
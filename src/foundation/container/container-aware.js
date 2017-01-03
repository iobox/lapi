import Container from './container'
export default class ContainerAware {
  /**
   * Constructor
   * @param {Container} [container=null]
   */
  constructor(container = null) {
    this.setContainer(container || new Container())
  }

  /**
   * Get container
   * @returns {Container}
   */
  getContainer() {
    return this._container
  }

  /**
   * Set container
   * @param {!Container} container
   */
  setContainer(container) {
    if (container instanceof Container) {
      this._container = container
    } else {
      throw new Error('[Foundation/Container/ContainerAware#setContainer] An instance of Container is required')
    }
  }
}
import Container from './container'

export default class Kernel {
  /**
   * Constructor
   * @param {Container} [container=null]
   */
  constructor(container = null) {
    if (container === null) {
      container = new Container()
    }
    this.setContainer(container)
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
      throw new Error('[Kernel#setContainer] An instance of Container is required')
    }
  }
}
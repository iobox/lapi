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
      throw new Error('[Foundation/Kernel#setContainer] An instance of Container is required')
    }
  }

  /**
   * Determine if abstract is registered
   * @param {string} abstract
   * @returns {boolean}
   */
  has(abstract) {
    return this.getContainer().has(abstract)
  }

  /**
   * Get a concrete of specific abstract
   * @param {string} abstract
   * @returns {*}
   */
  get(abstract) {
    if (!this.has(abstract)) {
      throw new Error('[Foundation/Kernel#get] ' + abstract + ' is not registered')
    }

    return this.getContainer().get(abstract)
  }

  /**
   * Set a concrete to be an implementation of abstract
   * @param {string} abstract
   * @param {?*} concrete
   */
  set(abstract, concrete) {
    this.getContainer().set(abstract, concrete)
  }
}
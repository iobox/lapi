import ContainerAware from './container-aware'
import NotFoundException from '../exception/not-found'
import InvalidArgumentException from '../exception/invalid-argument'

Function.prototype.construct = function(args) {
  var instance = Object.create(this.prototype)
  this.apply(instance, args)
  return instance
}

export class Definition {
  constructor(instance, shareable = true) {
    this.instance = instance
    this.shareable = shareable
  }

  get(args = null) {
    if (this.shareable) {
      return this.instance
    } else {
      if (typeof this.instance === 'function') {
        return this.instance.construct(args)
      } else if (typeof this.instance === 'object') {
        return Object.assign({}, this.instance)
      } else {
        throw new InvalidArgumentException(`[Definition#get] Unexpected type of instance`)
      }
    }

    return null
  }

  set(instance) {
    this.instance = instance
  }

  share(shareable = true) {
    this.shareable = shareable
  }
}

export default class Container {
  constructor() {
    this._definitions = {}
  }

  /**
   * Determine whether or not a name is registered
   * @param name
   * @returns {boolean}
   */
  has(name) {
    return this._definitions[name] !== undefined
  }

  /**
   * Get instance of a registered name
   * @param name
   * @param args
   * @returns {*}
   * @throws {NotFoundException} throws an exeception when name is not registered in container
   */
  get(name, ...args) {
    if (this.has(name)) {
      return this._definitions[name].get(args)
    } else {
      throw new NotFoundException(`[Container#get] ${name} is not registered in container`)
    }
  }

  /**
   * Set instance to a specific name
   * @param {string} name
   * @param {*} instance
   * @param {boolean} shareable
   * @returns {Definition}
   */
  set(name, instance, shareable = true) {
    if (instance instanceof ContainerAware) {
      instance.setContainer(this)
    }

    if (this.has(name)) {
      this._definitions[name].set(instance)
      this._definitions[name].share(shareable)
    } else {
      this._definitions[name] = new Definition(instance, shareable)
    }

    return this._definitions[name]
  }

  /**
   * Set shareable for a registered name
   * @param {string} name
   * @param {boolean} shareable
   */
  share(name, shareable = true) {
    if (this.has(name)) {
      this._definitions[name].share(shareable)
    } else {
      throw new NotFoundException(`[Container#get] ${name} is not registered in container`)
    }
  }

  /**
   * Get definition by name
   * @param {string} name
   * @returns {null|Definition}
   */
  getDefinition(name) {
    return this.has(name) ? this._definitions[name] : null
  }

  /**
   * Set definition by name
   * @param {string} name
   * @param {Definition} definition
   */
  setDefinition(name, definition) {
    this._definitions[name] = definition
  }
}
export default class Base {
  constructor(source) {
    this._source = source
  }

  /**
   * Create new instance of Base from source
   * @param {Object} source
   * @returns {Base}
   */
  static from(source) {
    return new Base(source)
  }

  use(target, methods) {
    let source = this._source
    switch (typeof this._source) {
      case 'object':
        source = this._source.constructor
        break
      case 'function':
      default:
        source = this._source
        break
    }

    Object.getOwnPropertyNames(target.prototype)
      .concat(Object.getOwnPropertySymbols(target.prototype))
      .forEach((prop) => {
        if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
          return
        }

        let method = prop
        if (typeof methods === 'object' && methods[prop] !== undefined) {
          method = methods[prop]
        }
        Object.defineProperty(source.prototype, method, Object.getOwnPropertyDescriptor(target.prototype, prop))
      })

    return this
  }

  uses(...args) {
    args.forEach((arg) => {
      this.use.apply(this, arg)
    })
  }
}
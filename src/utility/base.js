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
        Object.defineProperty(this._source, method, Object.getOwnPropertyDescriptor(target.prototype, prop))
      })
    return this
  }

  uses(...args) {
    args.forEach((arg) => {
      this.use.apply(this, arg)
    })
  }
}
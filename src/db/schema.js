import Bag from '../foundation/bag'
export default class Schema extends Bag {
  constructor(data) {
    super()
    this.extend(data)
  }

  /**
   * Set key-value
   * @override
   * @param {!string} key
   * @param {Object|Bag|*} value
   */
  set(key, value) {
    const type = typeof value
    switch (type) {
      case 'object':
        super.set(key, new Bag(value))
        break
      default:
        const val = value
        value     = new Bag()
        value.set(Schema.TYPE, val)
        super.set(key, value)
        break
    }
  }
}
Schema.KEY           = 'key'
Schema.REF           = 'ref'
Schema.FUNC_SET      = '$set'
Schema.FUNC_GET      = '$get'
Schema.TYPE          = 'type'
Schema.TYPE_STRING   = 'string'
Schema.TYPE_INT      = 'int'
Schema.TYPE_FLOAT    = 'float'
Schema.TYPE_NUMBER   = 'number'
Schema.TYPE_BUFFER   = 'buffer'
Schema.TYPE_ARRAY    = 'array'
Schema.TYPE_DATE     = 'date'
Schema.TYPE_DATETIME = 'datetime'
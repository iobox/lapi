import Bag from '../foundation/bag'
import Model from './model'
export default class Schema extends Bag {
  constructor(data) {
    super(data)
    this.forEach((field, value) => {
      this.set(field, value)
    })
  }

  set(key, value) {
    const type = typeof value
    switch (type) {
      case 'object':
        super.set(key, new Bag(value))
        break
      default:
        const val = value
        value = new Bag()
        value.set(Schema.TYPE, val)
        super.set(key, value)
        break
    }
  }

  /**
   * Get key
   * @param {Model} model
   * @returns {Object}
   */
  getKey(model) {
    let key = {}
    this.forEach((field, value) => {
      if (value.has(Schema.KEY) && value.get(Schema.KEY) === true) {
        key[field] = this.getValue(field, model)
      }
    })
    return key
  }

  getValue(field, model) {

  }

  setValue(field, model) {

  }
}
Schema.KEY           = 'key'
Schema.REF           = 'ref'
Schema.TYPE          = 'type'
Schema.TYPE_STRING   = 'string'
Schema.TYPE_INT      = 'int'
Schema.TYPE_FLOAT    = 'float'
Schema.TYPE_BUFFER   = 'buffer'
Schema.TYPE_ARRAY    = 'array'
Schema.TYPE_DATE     = 'date'
Schema.TYPE_DATETIME = 'datetime'
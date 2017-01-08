import Bag from '../foundation/bag'
import Model from './model'
import NotFoundException from '../exception/not-found'
import InvalidArgumentException from '../exception/invalid-argument'
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

  /**
   * Get identity key(s)
   * @param {Model} model
   * @returns {Object}
   */
  getIdentity(model) {
    let identity = {}
    this.forEach((field, options) => {
      if (options.has(Schema.KEY) && options.get(Schema.KEY) === true) {
        identity[field] = this.getValue(field, model)
      }
    })
    return identity
  }

  /**
   * Get value of model
   * @param {string} field
   * @param {Model} model
   * @returns {*}
   * @throws {NotFoundException} throws an exception when field is not registered in Db/Schema
   * @throws {InvalidArgumentException} throws an exception when model is not an instance of Db/Model
   */
  getValue(field, model) {
    if (!this.has(field)) {
      throw new NotFoundException(`[Db/Schema#getValue] field "${field}" is not registered in Db/Schema`)
    }
    if (!(model instanceof Model)) {
      throw new InvalidArgumentException('[Db/Schema#getValue] model must be an instance of Db/Model')
    }
    const options = this.get(field)
    let value = model.raw([field])[field]
    if (options.has(Schema.FUNC_GET)) {
      value = options.get(Schema.FUNC_GET)(value)
    } else if (options.has(Schema.TYPE)) {
      switch (options.get(Schema.TYPE)) {
        case Schema.TYPE_INT:
          value = parseInt(value)
          break
        case Schema.TYPE_FLOAT:
          value = parseFloat(value)
          break
        case Schema.TYPE_BUFFER:
          break
        case Schema.TYPE_ARRAY:
        case Array:
          break
        case Schema.TYPE_DATE:
          break
        case Schema.TYPE_DATETIME:
          break
        case Schema.TYPE_STRING:
        case String:
          break
        case Schema.TYPE_NUMBER:
        case Number:
          break
        default:
          break
      }
    }

    return value
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
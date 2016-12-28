import QueryExtensionInterface from './interface'
import Bag from '../../../foundation/bag'

/**
 * @implements {QueryExtensionInterface}
 */
export default class CommonExtension extends QueryExtensionInterface {
  getName() {
    return 'http.query.extension.common'
  }

  register() {
    return [
      'require',
      'allowNull',
      'allowEmpty'
    ]
  }

  /**
   * Require field must exist
   * @param {!Bag} query
   * @param {!string} field
   * @param {!boolean} option
   */
  require(query, field, option) {
    if (option === true && query.has(field) === false) {
      throw new Error(`${field} is required`)
    }
  }

  /**
   * Allow field has null value or not
   * @param {!Bag} query
   * @param {!string} field
   * @param {!boolean} option
   */
  allowNull(query, field, option) {
    if (option === false && query.has(field) === true && query.get(field) === null) {
      throw new Error(`${field} must not be null`)
    }
  }

  /**
   * Allow field has empty value or not
   * @param {!Bag} query
   * @param {!string} field
   * @param {!boolean} option
   */
  allowEmpty(query, field, option) {
    if (option === false && query.has(field) === true && query.get(field) === '') {
      throw new Error(`${field} must not be empty`)
    }
  }
}
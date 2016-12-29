import Exception from '../../foundation/exception'

export default class HttpException extends Exception {
  /**
   * Constructor
   * @param {string} [message='']
   * @param {?(number|string)} [code=null]
   * @param {?number} [statusCode=null]
   */
  constructor(message = '', code = null, statusCode = null) {
    super(message, code)
    this.setStatusCode(statusCode)
  }

  /**
   * Get HTTP Status Code
   * @returns {number}
   */
  getStatusCode() {
    return this._statusCode
  }

  /**
   * Set HTTP Status Code
   * @param {number} statusCode
   * @throws {Exception} throws an exception if statusCode is not an integer
   */
  setStatusCode(statusCode) {
    if (Number.isInteger(statusCode)) {
      this._statusCode = statusCode
    } else {
      throw new Exception('[Http/Exception/Http#setStatusCode] statusCode must be an integer')
    }
  }
}
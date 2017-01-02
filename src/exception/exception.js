export default class Exception {
  /**
   * Constructor
   * @param {string} [message='']
   * @param {?(number|string)} [code=null]
   */
  constructor(message = '', code = null) {
    this.setMessage(message)
    this.setCode(code)
  }

  /**
   * Get Exception's message
   * @returns {string}
   */
  getMessage() {
    return this._message
  }

  /**
   * Set Exception's message
   * @param {string} message
   */
  setMessage(message) {
    this._message = message
  }

  /**
   * Get Exception's code
   * @returns {?(number|string)}
   */
  getCode() {
    return this._code
  }

  /**
   * Set Exception's code
   * @param {?(number|string)} code
   */
  setCode(code) {
    this._code = code
  }
}
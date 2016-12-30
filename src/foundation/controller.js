import Kernel from './kernel'
import Request from '../http/request'
import Response from '../http/response'
import InvalidArgumentException from '../exception/invalid-argument'

export default class Controller extends Kernel {
  /**
   * Constructor
   * @param {?Request} [request=null]
   * @param {?Response} [response=null]
   */
  constructor(request = null, response = null) {
    super()
    this.setRequest(request || new Request())
    this.setResponse(response || new Response())
  }

  /**
   * This method would be called before running active action
   */
  beforeAction() {}

  /**
   * This method would be called after receiving data from action
   * @param {?(Object|Response|string)} response
   */
  afterAction(response = null) {}

  /**
   * Get Request
   * @returns {Request}
   */
  getRequest() {
    return this._request
  }

  /**
   * Set Request
   * @param {Request} request
   * @throws {InvalidArgumentException} throws an exception when request is not an instance of Request
   */
  setRequest(request) {
    if (request instanceof Request) {
      this._request = request
    } else {
      throw new InvalidArgumentException('[Foundation/Controller#setRequest] request must be an instance of Request')
    }
  }

  /**
   * Get Response
   * @returns {Response}
   */
  getResponse() {
    return this._response
  }

  /**
   * Set Response
   * @param {Response} response
   * @throws {InvalidArgumentException} throws an exception when response is not an instance of Response
   */
  setResponse(response) {
    if (response instanceof Response) {
      this._response = response
    } else {
      throw new InvalidArgumentException('[Foundation/Controller#setResponse] request must be an instance of Response')
    }
  }
}
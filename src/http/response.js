import Message from './message'
import Header from './header'
import NotImplementedException from '../exception/not-implemented'

/**
 * HTTP Response
 */
export default class Response extends Message {
  /**
   * Constructor
   * @param {?(string|Object)} [content={}] Response's body content
   * @param {!number} [statusCode=200] Response's status code, default is OK
   * @param {?Object} [header={}] Initial headers
   */
  constructor(content = '', statusCode = Response.HTTP_OK, header = {}) {
    super()

    this.getBody().setContent(content)
    this.setStatusCode(statusCode)
    this.getHeader().extend(header)
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
   * @param {!number} statusCode
   */
  setStatusCode(statusCode) {
    this._statusCode = statusCode
  }

  /**
   * Set body content
   * @param {*} content
   */
  setContent(content) {
    throw new NotImplementedException()
  }

  /**
   * Get body content
   * @returns {*}
   */
  getContent() {
    throw new NotImplementedException()
  }

  /**
   * Send response to client
   * @param {?Object} resource Original response's resource. It should be an instance of http.ServerResponse
   */
  send(resource = null) {
    this.getHeader().set(Header.CONTENT_TYPE, this.getBody().getContentType())
    this.getHeader().forEach((key, value) => {
      resource.setHeader(key, value)
    })

    resource.statusCode = this.getStatusCode()
    resource.end(this.getBody().toString())
  }

  /**
   * Create a response from resource
   * @param {*} resource
   * @returns {Promise}
   */
  static from(resource) {
    if (resource === null || typeof resource !== 'object') {
      throw new Error('The resource of response must be an object.')
    }

    return new Promise((resolve, reject) => {
      let response = new Response()
      this._setUpHeader(response, resource)
      this._setUpBody(response, resource)
        .then(() => { resolve(response) })
        .catch(e => reject(e))
    })
  }

  /**
   * Setup Header
   * @param {Response} response
   * @param {*} resource
   * @private
   */
  static _setUpHeader(response, resource) {
    Object.keys(resource.headers).forEach(key => response.getHeader().set(key, resource.headers[key]))
    response.getBody().setContentType(response.getHeader().get(Header.CONTENT_TYPE))
    response.setStatusCode(resource.statusCode)
  }

  /**
   * Setup Body Content
   * @param {Response} response
   * @param {*} resource
   * @returns {Promise}
   * @private
   */
  static _setUpBody(response, resource) {
    return new Promise((resolve, reject) => {
      let data = ''
      resource.on('data', (chunk) => data += chunk)
      resource.on('end', () => {
        response.getBody().setContent(data)
        resolve()
      })
      resource.on('error', e => reject(e))
    })
  }
}
Response.HTTP_OK                  = 200
Response.HTTP_CREATED             = 201
Response.HTTP_ACCEPTED            = 202
Response.HTTP_NO_CONTENT          = 204
Response.HTTP_RESET_CONTENT       = 205
Response.HTTP_MOVED_PERMANENTLY   = 301
Response.HTTP_FOUND               = 302
Response.HTTP_NOT_MODIFIED        = 304
Response.HTTP_BAD_REQUEST         = 400
Response.HTTP_UNAUTHORIZED        = 401
Response.HTTP_FORBIDDEN           = 403
Response.HTTP_NOT_FOUND           = 404
Response.HTTP_METHOD_NOT_ALLOWED  = 404
Response.HTTP_REQUEST_TIMEOUT     = 408
Response.HTTP_TOO_MANY_REQUESTS   = 429
Response.HTTP_INTERNAL_ERROR      = 500
Response.HTTP_NOT_IMPLEMENTED     = 501
Response.HTTP_BAD_GATEWAY         = 502
Response.HTTP_SERVICE_UNAVAILABLE = 503
Response.HTTP_GATEWAY_TIMEOUT     = 504

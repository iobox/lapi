import Body from './body'
import Message from './message'
import Header from './header'
import InvalidArgumentException from './exception/invalid-argument'

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
  constructor(content = {}, statusCode = Response.HTTP_OK, header = {}) {
    super()

    if (typeof content === 'object') {
      this.getBody().setContent(JSON.stringify(content))
      this.getBody().setContentType(Body.CONTENT_JSON)
    } else if (typeof content === 'string') {
      this.getBody().setContent(content)
      this.getBody().setContentType(Body.CONTENT_HTML)
    } else {
      throw new InvalidArgumentException('[Http/Response#constructor] content must be either an object or a string')
    }
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
   * Send response to client
   * @param {?Object} resource Original response's resource. It should be an instance of http.ServerResponse
   */
  send(resource = null) {
    this.getHeader().set(Header.CONTENT_TYPE, this.getBody().getContentType())
    this.getHeader().forEach((key, value) => {
      resource.setHeader(key, value)
    })

    resource.statusCode    = this.getStatusCode()
    resource.end(this.getBody().toString())
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

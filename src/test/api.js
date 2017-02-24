import Request from '../http/request'
import Response from '../http/response'
import InvalidArgumentException from '../exception/invalid-argument'
import Spec from './spec'
var http = require('http')

export default class Api {
  constructor(options = {}) {
    this._default = {
      port: 7777,
      host: '127.0.0.1',
      timeout: 180000 // 180 seconds
    }
    this._options = Object.assign(this._default, options)
  }

  /**
   * Call a request
   * @param {Request} request
   * @returns {Promise}
   */
  call(request) {
    if (!(request instanceof Request)) {
      throw new InvalidArgumentException(`[test.Api#call] request must be an instance of Request`)
    }

    return new Promise((resolve, reject) => {
      let options = Object.assign({}, this._options)
      options.method = request.getMethod()
      options.path = request.getPath()
      options.headers = request.getHeader().all()

      const req = http.request(options, (res) => {
        Response.from(res).then(response => {
          resolve(new Api.Spec(response))
        })
      })

      req.on('error', e => reject(e))
      if (request.getMethod() !== Request.METHOD_GET && request.getContent() !== '') {
        req.write(request.getContent())
      }
      req.end()
    })
  }

  /**
   * GET request
   * @param {string} uri
   * @param {Object} query
   * @param {Object} header
   * @returns {Promise}
   */
  get(uri, query = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_GET, uri, query, {}, header))
  }

  /**
   * POST request
   * @param {string} uri
   * @param {Object} content
   * @param {Object} header
   * @returns {Promise}
   */
  post(uri, content = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_POST, uri, {}, content, header))
  }

  /**
   * PUT request
   * @param {string} uri
   * @param {Object} content
   * @param {Object} header
   * @returns {Promise}
   */
  put(uri, content = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_PUT, uri, {}, content, header))
  }

  /**
   * PATCH request
   * @param {string} uri
   * @param {Object} content
   * @param {Object} header
   * @returns {Promise}
   */
  patch(uri, content = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_PATCH, uri, {}, content, header))
  }

  /**
   * DELETE request
   * @param {string} uri
   * @param {Object} header
   * @returns {Promise}
   */
  delete(uri, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_DELETE, uri, {}, {}, header))
  }

  /**
   * Make a request instance
   * @param method
   * @param uri
   * @param query
   * @param content
   * @param header
   * @returns {Request}
   * @private
   */
  _makeRequest(method, uri, query = {}, content = {}, header = {}) {
    let request = new Request()
    request.setMethod(method)
    request.setUri(uri)
    request.setQuery(query)
    request.setContent(content)
    request.setHeader(header)
    return request
  }
}
Api.Spec = Spec
import Request from '../http/request'
import Response from '../http/response'
import Header from '../http/header'
import Body from '../http/body'
import Base from '../util/base'
import Spec from './spec'
import InvalidArgumentException from '../exception/invalid-argument'
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
   * Make an API call
   * @param {Request} request
   * @returns {Executor}
   */
  call(request) {
    if (!(request instanceof Request)) {
      throw new InvalidArgumentException(`[test.Api#call] request must be an instance of Request`)
    }

    return new Executor(request, this._options)
  }

  /**
   * GET request
   * @param {string} uri
   * @param {Object} query
   * @param {Object} header
   * @returns {Executor}
   */
  get(uri, query = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_GET, uri, query, {}, header))
  }

  /**
   * POST request
   * @param {string} uri
   * @param {Object} content
   * @param {Object} header
   * @returns {Executor}
   */
  post(uri, content = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_POST, uri, {}, content, header))
  }

  /**
   * PUT request
   * @param {string} uri
   * @param {Object} content
   * @param {Object} header
   * @returns {Executor}
   */
  put(uri, content = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_PUT, uri, {}, content, header))
  }

  /**
   * PATCH request
   * @param {string} uri
   * @param {Object} content
   * @param {Object} header
   * @returns {Executor}
   */
  patch(uri, content = {}, header = {}) {
    return this.call(this._makeRequest(Request.METHOD_PATCH, uri, {}, content, header))
  }

  /**
   * DELETE request
   * @param {string} uri
   * @param {Object} header
   * @returns {Executor}
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
    if (!request.getHeader().has(Header.CONTENT_TYPE)) {
      request.getHeader().set(Header.CONTENT_TYPE, Body.CONTENT_JSON)
    }

    return request
  }
}
Api.Spec = Spec

class Executor {
  /**
   * Constructor
   * @param {Request} request
   * @param {Object} [options={}]
   */
  constructor(request, options = {}) {
    this._request    = request
    this._options    = options
    this._attributes = null
    this._resolve    = null
    this._reject     = null
    this._done       = null
  }

  /**
   * Add attributes
   * @param {Object} attributes
   * @returns {Executor}
   */
  with(attributes) {
    this._attributes = attributes
    return this
  }

  /**
   * Add callback to be executed for every requests
   * @param resolve
   * @returns {Executor}
   */
  then(resolve) {
    this._resolve = resolve

    this.execute()
      .catch(e => this._reject(e))

    return this
  }

  /**
   * Add callback which is called whenever there is an error
   * @param reject
   * @returns {Executor}
   */
  catch(reject) {
    this._reject = reject
    return this
  }

  /**
   * Add callback which is run when every thing has been done
   * @param {Function} done
   * @returns {Executor}
   */
  done(done) {
    this._done = done
    return this
  }

  /**
   * Execute an API call
   * @returns {Promise}
   */
  execute() {
    if (this._attributes === null) {
      return this._executeOne(this._request)
    } else {
      return this._executeMany(this._request)
    }
  }

  /**
   * Execute single request
   * @param {Request} request
   * @param {Object} [attributes={}]
   * @returns {Promise}
   * @private
   */
  _executeOne(request, attributes = {}) {
    let spec = new Api.Spec()
    spec.setRequest(request)
    spec.setAttributes(attributes)
    spec.setUp()

    return (new Promise((resolve, reject) => {
      const request   = spec.getRequest()
      let options     = Object.assign({}, this._options)
      options.method  = request.getMethod()
      options.path    = request.getPath()
      options.headers = request.getHeader().all()

      const req = http.request(options, (res) => {
        Response.from(res).then(response => {
          spec.setResponse(response)
          spec.tearDown()
          resolve(spec)
        })
      })

      req.on('error', e => reject(e))
      if (request.getMethod() !== Request.METHOD_GET && request.getContent() !== '') {
        req.write(request.getContent())
      }
      req.end()
    })).then(spec => this._resolve(spec))
  }

  /**
   * Execute multiple requests
   * @param {Request} request
   * @returns {Promise}
   * @private
   */
  _executeMany(request) {
    const keys = Object.keys(this._attributes)
    if (!Array.isArray(this._attributes[keys[0]])) {
      throw new InvalidArgumentException('[test.Api#_executeMany] first attribute must be an array')
    }

    let attributes, tasks = []
    for (var i = 0; i < this._attributes[keys[0]].length; i++) {
      attributes = {}
      for (var j = 0; j < keys.length; j++) {
        attributes[keys[j]] = this._attributes[keys[j]][i]
      }
      tasks.push(this._executeOne(Base.from(request).clone(), attributes))
    }

    return Promise.all(tasks).then((results) => {
      this._done(results)
    })
  }
}
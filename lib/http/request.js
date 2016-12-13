const url = require('url')
import Bag from '../bag'
import Message from './message'

/**
 * Http Request
 *
 * Contains information about request
 */
export default class Request extends Message {
  /**
   * Constructor
   * @param {?Object} [resource={}] The original resource of request, it should be an instance of IncomingMessage
   */
  constructor(resource = {}) {
    super()
    this.setMethod(Request.METHOD_GET)
    this.setQuery(new Bag())
    this.setServer(new Bag())
    this.setClient(new Bag())
    this.setResource(resource)
  }

  /**
   * Set original resource
   * @param {*} resource
   */
  setResource(resource) {
    if (resource === null || typeof resource !== 'object') {
      throw new Error('The resource of request must be an object.')
    }

    super.setResource(resource)
    this._setUpMethod()
    this._setUpHeader()
    this._setUpQuery()
    this._setUpServer()
    this._setUpClient()
  }

  /**
   * Get request's method (GET|POST|PUT|PATCH|DELETE|OPTIONS)
   * @returns {string}
   */
  getMethod() {
    return this._method
  }

  /**
   * Set request's method
   * @param {!string} method
   */
  setMethod(method) {
    this._method = method
  }

  /**
   * Get request's query
   * @returns {Bag}
   */
  getQuery() {
    return this._query
  }

  /**
   * Set request's query
   * @param {Bag|Object|string} query
   */
  setQuery(query) {
    if (query instanceof Bag) {
      this._query = query
    } else if (typeof query === 'object') {
      this._query = new Bag(query)
    } else if (typeof query === 'string') {
      this._query = new Bag(url.parse(query, true).query)
    } else {
      throw new Error('The query of request must be either a string, an instance of Bag or an object.')
    }
  }

  /**
   * Return server's information
   * @returns {Bag}
   */
  getServer() {
    return this._server
  }

  /**
   * Set server's information
   * @param {Bag|Object} [server={}]
   */
  setServer(server = {}) {
    if (server instanceof Bag) {
      this._server = server
    } else if (typeof server === 'object') {
      this._server = new Bag(server)
    } else {
      throw new Error('The request\'s server information must be either an instance of Bag or an object.')
    }
  }

  /**
   * Return client's information
   * @returns {Bag}
   */
  getClient() {
    return this._client
  }

  /**
   * Set client's information
   * @param {Bag|Object} [client={}]
   */
  setClient(client = {}) {
    if (client instanceof Bag) {
      this._client = client
    } else if (typeof client === 'object') {
      this._client = new Bag(client)
    } else {
      throw new Error('The request\'s client information must be either an instance of Bag or an object.')
    }
  }

  /**
   * Set up header from resource
   * @private
   */
  _setUpHeader() {
    const resource = this.getResource()
    if (resource.rawHeaders !== undefined) {
      for (let i = 0; i < resource.rawHeaders.length; i++) {
        this.getHeader().set(resource.rawHeaders[i], resource.rawHeaders[++i])
      }
    }
  }

  /**
   * Setup query from resource's url
   * @private
   */
  _setUpQuery() {
    if (this.getResource().url !== undefined) {
      this.setQuery(this.getResource().url)
    }
  }

  /**
   * Set up method of request
   * @private
   */
  _setUpMethod() {
    if (this.getResource().method !== undefined) {
      this.setMethod(this.getResource().method)
    }
  }

  /**
   * Set up information about request's server
   * @private
   */
  _setUpServer() {
    if (this.getResource().connection !== undefined) {
      const connection = this.getResource().connection
      this.getClient().set(Request.SERVER_HOST, connection.address().address)
      this.getClient().set(Request.SERVER_PORT, connection.address().port)
      this.getClient().set(Request.ADDRESS_FAMILY, connection.address().family)
      this.getClient().set(Request.LOCAL_HOST, connection.localAddress)
      this.getClient().set(Request.LOCAL_PORT, connection.localPort)
    }
  }

  /**
   * Set up information about request's client source
   * @private
   */
  _setUpClient() {
    if (this.getResource().connection !== undefined) {
      const connection = this.getResource().connection
      this.getClient().set(Request.CLIENT_HOST, connection.remoteAddress)
      this.getClient().set(Request.CLIENT_PORT, connection.remotePort)
      this.getClient().set(Request.ADDRESS_FAMILY, connection.remoteFamily)
    }
  }
}
Request.METHOD_GET    = 'GET'
Request.METHOD_POST   = 'POST'
Request.METHOD_PUT    = 'PUT'
Request.METHOD_PATCH  = 'PATCH'
Request.METHOD_DELETE = 'DELETE'
Request.METHOD_HEAD   = 'HEAD'
Request.METHOD_OPTION = 'OPTION'

Request.DEFAULT_METHOD = 'GET'
Request.DEFAULT_PATH   = '/'

Request.ADDRESS_FAMILY = 'family'
Request.ADDRESS_HOST   = 'host'
Request.ADDRESS_PORT   = 'port'
Request.SERVER_HOST    = Request.ADDRESS_HOST
Request.SERVER_PORT    = Request.ADDRESS_PORT
Request.CLIENT_HOST    = Request.ADDRESS_HOST
Request.CLIENT_PORT    = Request.ADDRESS_PORT
Request.LOCAL_HOST     = Request.ADDRESS_HOST
Request.LOCAL_PORT     = Request.ADDRESS_PORT

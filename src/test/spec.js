import Bag from '../foundation/bag'
import Request from '../http/request'
import Response from '../http/response'
import Base from '../util/base'
import HeaderSpec from './spec/header'
import BodySpec from './spec/body'
import HttpSpec from './spec/http'
import InvalidArgumentException from '../exception/invalid-argument'

export default class Spec {
  constructor(request = null, response = null) {
    this._request    = request
    this._response   = response
    this._attributes = new Bag()

    Base.from(this).uses([HeaderSpec], [BodySpec], [HttpSpec])
  }

  /**
   * Get request
   * @returns {Request}
   */
  getRequest() {
    return this._request
  }

  /**
   * Set request
   * @param {Request} request
   */
  setRequest(request) {
    if (request instanceof Request) {
      this._request = request
    } else {
      throw new InvalidArgumentException('[test.Spec#setRequest] request must be an instance of Request')
    }
  }

  /**
   * Get response
   * @returns {Response}
   */
  getResponse() {
    return this._response
  }

  /**
   * Set response
   * @param {Response} response
   */
  setResponse(response) {
    if (response instanceof Response) {
      this._response = response
    } else {
      throw new InvalidArgumentException('[test.Spec#setResponse] response must be an instance of Response')
    }
  }

  /**
   * Get attributes
   * @returns {Bag}
   */
  getAttributes() {
    return this._attributes
  }

  /**
   * Set and replace attributes
   * @param {Bag|Object} attributes
   */
  setAttributes(attributes) {
    if (attributes instanceof Bag) {
      this._attributes = attributes
    } else if (typeof attributes === 'object') {
      this._attributes = new Bag(attributes)
    } else {
      throw new InvalidArgumentException('[test.Spec#with] attributes must be either an object or an instance of Bag')
    }
  }

  /**
   * Set and replace attributes
   * Alias of setAttributes
   * @see setAttributes
   * @param {Bag|Object} attributes
   */
  with(attributes) {
    this.setAttributes(attributes)
  }

  /**
   * Get value of an attribute
   * @param {string} attribute Name of attribute to get
   * @param {*} [def=null] Default value to return in case attribute could not be found
   * @returns {*}
   */
  get(attribute, def = null) {
    return this.getAttributes().get(attribute, def)
  }

  /**
   * Set value of an attribute
   * @param {string} attribute Name of attribute to set
   * @param {*} value Value of attribute
   */
  set(attribute, value) {
    this.getAttributes().set(attribute, value)
  }

  /**
   * Set up spec
   *
   * In order to extend this method, super method must be called first
   */
  setUp() {
    let matches, content = this.getRequest().getBody().getParsedContent()
    for (let [key, value] of content) {
      matches =value.match(/^<(\w+)>$/i)
      if (typeof value === 'string' && matches) {
        content.set(key, this.get(matches[1]))
      }
    }
    this.getRequest().setContent(content.all())
  }

  /**
   * Clean up spec
   */
  tearDown() {
  }
}
import Bag from '../../bag'
import Request from '../request'

const SRC_HOST = 'host'
const SRC_PATH = 'path'

function scanAndReplace(text, source, target) {
  if (text === null) {
    // do nothing
    return
  }

  const o = Route.MATCH_OPENING_TAG,
        c = Route.MATCH_CLOSING_TAG

  const pattern = `${o}(\\w+)${c}`,
        matches = text.match(new RegExp(pattern, 'ig')),
        args    = Object.keys(source)

  if (matches === null || typeof target !== 'object') {
    // do nothing
    return text
  }

  // loop matches to replace in text
  matches.forEach((match) => {
    let replacement = /\w+/,
        argument    = match.replace(new RegExp(`${o}|${c}`, 'ig'), '')

    for (let i = 0; i < args.length; i++) {
      if (match === `${o}${args[i]}${c}`) {
        argument    = args[i]
        replacement = source[argument]
        break
      }
    }

    if (typeof replacement === 'object' && replacement instanceof RegExp) {
      replacement = replacement.toString()
      replacement = replacement.replace(/^\/(.*)\/[a-z]*$/ig, '$1')
    }

    text             = text.replace(match, `(${replacement})`)
    target[argument] = null
  })

  return text
}

function matchAndApply(text, pattern, target) {
  if (text === undefined || pattern === undefined) {
    return false
  }

  if (text === null) {
    return true
  }

  const matches = text.match(pattern)
  if (matches === null) {
    return false
  }

  const args = Object.keys(target)
  for (let i = 1; i < matches.length; i++) {
    target[args[i - 1]] = matches[i]
  }

  return true
}

function validateRegExp(target) {
  if (typeof target === 'object' && target instanceof RegExp) {
    target = target.toString()
  }

  // consider to check for string only?
  return `^${target}$`
}

/**
 * Http Route
 */
export default class Route {
  /**
   * Constructor
   * @example
   * let route = new Route(
   *   'route_name',
   *   ['GET', 'POST'],
   *   '/accounts/{id}',
   *   '{language}.domain.com',
   *   6969,
   *   {id: /\d+/, language: /[a-zA-Z]{2}/},
   *   {format: 'json'},
   *   {useDb: true}
   * )
   *
   * @param {string} [name=''] Name of route, it should be an unique string
   * @param {Array|string} [methods=null] Accepted methods for route
   * @param {string} [path=''] Path of route, regexp string is allowed
   * @param {?string} [host=null] Expected host, default is null to ignore host
   * @param {Object} [requirements={}] Requirements of matching, it is optional of have pre-defined required properties of matching
   * @param {Object} [attributes={}] Additional attributes of route, it would be merged with matches result
   * @param {Object} [options={}] Route's options contain optional configuration
   */
  constructor(name = '',
              methods = null,
              path = '',
              host = null,
              requirements = {},
              attributes = {},
              options = {}) {
    this.setName(name)
    this.setMethods(methods)
    this.setPath(path)
    this.setHost(host)
    this.setPort(null)
    this.setRequirements(requirements)
    this.setAttributes(attributes)
    this.setOptions(options)
    this.setMatches({})
  }

  /**
   * Get name
   * @returns {string}
   */
  getName() {
    return this._name
  }

  /**
   * Set name
   * @param {!string} name
   */
  setName(name) {
    if (name === undefined) {
      throw new Error('Name of route must be a string.')
    }
    this._name = name
  }

  /**
   * List of accepted methods
   * @returns {Array}
   */
  getMethods() {
    return this._methods
  }

  /**
   * In case methods is a string, it would be converted to an array with single item
   * @param {Array} methods
   */
  setMethods(methods) {
    if (methods !== null && Array.isArray(methods) === false) {
      methods = [methods]
    }

    this._methods = methods
  }

  /**
   * Get path
   * @returns {string|null}
   */
  getPath() {
    return this._path
  }

  /**
   * Set path
   * @param {?string} path
   */
  setPath(path) {
    this._path = path
  }

  /**
   * Get host
   * @returns {string|null}
   */
  getHost() {
    return this._host
  }

  /**
   * Set host
   * @param {?string} host
   */
  setHost(host) {
    this._host = host
  }

  /**
   * Get port
   * @returns {int|null}
   */
  getPort() {
    return this._port
  }

  /**
   * Set port
   * @param {?int} port
   */
  setPort(port) {
    this._port = port
  }

  /**
   * Get requirements
   * @returns {Object}
   */
  getRequirements() {
    return this._requirements
  }

  /**
   * Set requirements
   * @param {?Object} requirements
   */
  setRequirements(requirements) {
    this._requirements = requirements
  }

  /**
   * Extra configuration for route
   * @returns {Bag}
   */
  getOptions() {
    return this._options
  }

  /**
   * Set options
   * @param {Bag|Object} options
   */
  setOptions(options) {
    if (typeof options === 'object') {
      if (options instanceof Bag) {
        this._options = options
      } else {
        this._options = new Bag(options)
      }
    }
  }

  /**
   * Get attributes
   * @returns {Object}
   */
  getAttributes() {
    return this._attributes
  }

  /**
   * Set attributes
   * @param {?Object} attributes
   */
  setAttributes(attributes) {
    this._attributes = attributes
  }

  /**
   * Get matches data
   * @returns {Object}
   */
  getMatches() {
    return Object.assign({}, this._matches[SRC_HOST], this._matches[SRC_PATH])
  }

  /**
   * Set matches data
   * @param {!Object} matches
   */
  setMatches(matches) {
    this._matches = matches
  }

  /**
   * Define whether or not a request has been matched to this route
   * @param {Request} request
   * @returns {boolean}
   */
  match(request) {
    /* Run pre-actions */
    this.preMatch()

    let isMatched = false
    if (
      (this.getMethods() === null || this.getMethods().indexOf(request.getMethod()) >= 0)
      && (this.getHost() === null || matchAndApply(request.getHost(), this.getHost(), this._matches[SRC_HOST]))
      && (this.getPath() === null || matchAndApply(request.getPath(), this.getPath(), this._matches[SRC_PATH]))
      && (this.getPort() === null || (!Number.isNaN(request.getPort()) && request.getPort() === this.getPort()))
    ) {
      isMatched = true
    }

    /* Run post-actions */
    this.postMatch()

    return isMatched
  }

  /**
   * Prepare before matching
   * @protected
   */
  preMatch() {
    this.cleanUp()

    this._reservedHost = this.getHost()
    this._reservedPath = this.getPath()

    this.setHost(this.getHost() === null ? null : scanAndReplace(validateRegExp(this.getHost()), this.getRequirements(), this._matches[SRC_HOST]))
    this.setPath(this.getPath() === null ? null : scanAndReplace(validateRegExp(this.getPath()), this.getRequirements(), this._matches[SRC_PATH]))
  }

  /**
   * Perform actions after matching
   * @protected
   */
  postMatch() {
    this.setHost(this._reservedHost)
    this.setPath(this._reservedPath)

    this._reservedHost = null
    this._reservedPath = null
  }

  /**
   * Clean up data
   * @protected
   */
  cleanUp() {
    this._matches[SRC_HOST] = {}
    this._matches[SRC_PATH] = {}
  }

  /**
   * Convert an object to route instance
   * @param {Object} object
   * @returns {Route}
   */
  static from(object) {
    let route = new this
    route.setName(object.name || '')
    route.setMethods(object.methods || [Request.DEFAULT_METHOD])
    route.setPath(object.path || '')
    route.setHost(object.host || null)
    route.setPort(object.port || null)
    route.setOptions(object.options || {})
    route.setRequirements(object.requirements || {})
    route.setAttributes(object.attributes || {})

    return route
  }
}
Route.MATCH_OPENING_TAG = '{'
Route.MATCH_CLOSING_TAG = '}'
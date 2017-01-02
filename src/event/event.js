import Exception from '../exception/exception'

/**
 * Represent for an event emitted by EventManager
 */
export default class Event {
  /**
   * Constructor
   * @param {string} name Event's name
   * @param {boolean} [parallel=false] Determine whether or not to allow running listeners in parallel
   */
  constructor(name, parallel = false) {
    /**
     * Event's name
     * @type {string}
     * @private
     */
    this._name = name

    /**
     * Define whether or not to run this event's listeners in parallel
     * @type {boolean}
     * @private
     */
    this._parallel = parallel

    /**
     * Determine whether or not to continue event loop
     * @type {boolean}
     * @private
     */
    this._continue = true

    /**
     * An error if exists
     * @type {Exception}
     * @private
     */
    this._error = null

    /**
     * An array contains results when all listeners are run
     * @type {Array}
     * @private
     */
    this._results = []
  }

  /**
   * ReadOnly name of event
   * @returns {string}
   */
  getName() {
    return this._name
  }

  /**
   * Stop running event any furthermore
   */
  stop() {
    this._continue = false
  }

  /**
   * Determine if the event is actually stopped or not
   * @returns {boolean}
   */
  isStopped() {
    return !this._continue
  }

  /**
   * Tells whether or not this event allow to run in parallel
   * @returns {boolean}
   */
  isParallel() {
    return this._parallel
  }

  /**
   * Allow to run in parallel or not
   * @param {boolean} parallel
   */
  parallel(parallel) {
    this._parallel = parallel
  }

  /**
   * Set error
   * @param {Exception|Error} e
   */
  setError(e) {
    if (e instanceof Error) {
      e = new Exception(e.message, e.code)
    }

    this._error = e
  }

  /**
   * Get error
   * @returns {Exception}
   */
  getError() {
    return this._error
  }

  /**
   * Is there an error
   * @returns {boolean}
   */
  hasError() {
    return this._error === null ? false : true
  }

  /**
   * Get results
   * @returns {Array}
   */
  getResults() {
    return this._results
  }

  /**
   * Set results
   * @param [Array] results
   */
  setResults(results) {
    this._results = results
  }
}
/**
 * Name of event
 * Derived class must override this static attribute
 * @type {string}
 */
Event.NAME = ''
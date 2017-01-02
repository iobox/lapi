import Event from './event'
import Exception from '../exception/exception'

/**
 * Event Listener
 *
 * Process event when it is emitted by the EventManager
 */
export default class EventListener {
  /**
   * Constructor
   * @param {!function} runner Callback function to process event, it would receive an event as input
   * @param {?number} [priority=5] Determine the order of listener in running queue
   * @param {?number} [limit=null] Define if this listen could only run at a specific times
   */
  constructor(runner, priority = EventListener.PRIORITY_NORMAL, limit = EventListener.LIMIT_NONE) {
    /**
     * @type {function}
     * @private
     */
    this._runner = runner

    /**
     * @type {number}
     * @private
     */
    this._priority = priority

    /**
     * @type {number}
     * @private
     */
    this._limit = limit
  }

  /**
   * Get runner
   * @returns {Function}
   */
  getRunner() {
    return this._runner
  }

  /**
   * Set runner
   * @param {Function} runner
   */
  setRunner(runner) {
    if (typeof runner !== 'function') {
      throw new Exception('[Event/Listener#setRunner] runner must be a function')
    }
    this._runner = runner
  }

  /**
   * Get limit
   * @returns {number}
   */
  getLimit() {
    return this._limit
  }

  /**
   * Set limit
   * @param {number} limit
   */
  setLimit(limit) {
    this._limit = limit
  }

  /**
   * Get priority
   * @returns {number}
   */
  getPriority() {
    return this._priority
  }

  /**
   * Set priority
   * @param {number} priority
   */
  setPriority(priority) {
    this._priority = priority
  }

  /**
   * Callback function to be called right after event is fired and stopped completely
   * @param {Event} event
   */
  onComplete(event) {}

  /**
   * Callback function to be run if there is an error when processing event
   * @param {Event} event An error may be acquired using event.getError
   */
  onError(event) {}
}
EventListener.LIMIT_NONE  = null
EventListener.LIMIT_ONCE  = 1
EventListener.LIMIT_TWICE = 2

EventListener.PRIORITY_LOW    = 1
EventListener.PRIORITY_NORMAL = 5
EventListener.PRIORITY_HIGH   = 10

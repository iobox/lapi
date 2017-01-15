import async from 'async'
import Bag from '../foundation/bag'
import EventListener from './listener'
import Exception from '../exception/exception'
import InvalidArgumentException from '../exception/invalid-argument'

/**
 * Get structure of an event item
 * @param {Array} listeners
 * @param {boolean} sorted
 * @returns {{listeners: Array, sorted: boolean}}
 */
const getEventItem = (listeners = [], sorted = false) => {
  return {
    listeners: listeners,
    sorted: sorted
  }
}

class CallableEventListener extends EventListener {
  constructor(runner, priority = EventListener.PRIORITY_NORMAL, limit = EventListener.LIMIT_NONE) {
    super(runner, priority, limit)

    /**
     * A callback for onComplete
     * @type {null|function}
     * @private
     */
    this._onComplete = null

    /**
     * A callback for onError
     * @type {null|function}
     * @private
     */
    this._onError = null
  }

  /**
   * Allow to run callback when onComplete is called
   * @param {function} onComplete
   */
  complete(onComplete) {
    this._onComplete = onComplete
  }

  /**
   * Allow to run callback when onError is called
   * @param {function} onError
   */
  error(onError) {
    this._onError = onError
  }

  onComplete(results) {
    if (this._onComplete) {
      this._onComplete(results)
    }
  }

  onError(error) {
    if (this._onError) {
      this._onError(error)
    }
  }
}

/**
 * Manage, emit events
 */
export default class EventManager {
  /**
   * Constructor
   */
  constructor() {
    /**
     * Registered events
     * @type {Bag}
     * @private
     */
    this._events = new Bag()
  }

  /**
   * Get registered events
   * @returns {Bag}
   */
  getEvents() {
    return this._events
  }

  /**
   * Set registered events
   * @param {Object|Bag} events
   * @throws {InvalidArgumentException} throws an exception if events is not an instance of Bag or an object
   */
  setEvents(events) {
    if (events instanceof Bag) {
      this._events = events
    } else if (typeof events === 'object') {
      this._events = new Bag(events)
    } else {
      throw new InvalidArgumentException('[Event/EventManager#setEvents] events must be an instance of Bag or an object')
    }
  }

  /**
   * Subscribe a listener to Event Manager
   *
   * @param {!string} name Name of event to subscribe
   * @param {!EventListener} listener A listener object to handle incoming event
   * @throws {Exception} throws an exception if listener is not an instance of Event/EventListener
   */
  subscribe(name, listener) {
    if (!(listener instanceof EventListener)) {
      throw new Exception('[Event/EventManager#subscribe] listener must be an instance of Event/EventListener')
    }
    this.on(name, listener.getRunner(), listener.getPriority(), listener.getLimit())
  }

  /**
   * Unsubscribe a listener
   *
   * @param {!string} name Name of event to unsubscribe
   * @param {!EventListener} listener EventListener to unsubscribe
   */
  unsubscribe(name, listener) {
    if (!(listener instanceof EventListener)) {
      throw new Error('[Event/EventManager#unsubscribe] listener must be an instance of Event/EventListener')
    }
    this.off(name, listener.getPriority())
  }

  /**
   * Register an event handler
   *
   * @param {!string} name Name of event to listen
   * @param {!function} runner Callback to handle incoming event
   * @param {?number} priority Higher priority handler will be call later than the others
   * @param {?number} limit Number of times to be run. Default is null to ignore limit
   * @returns {EventListener} EventListener instance of registration
   */
  on(name, runner, priority, limit) {
    if (!this.getEvents().has(name)) {
      this.getEvents().set(name, getEventItem())
    }

    let listener = new CallableEventListener(runner, priority, limit)
    this.getEvents().get(name).listeners.push(listener)

    return listener
  }

  /**
   * Register an one time handler of a specific event
   *
   * @param {!string} name Name of event to listen
   * @param {!function} runner Callback to handle incoming event
   * @param {?number} priority Higher priority handler will be call later than the others
   * @returns {EventListener} EventListener instance of registration
   */
  once(name, runner, priority) {
    return this.on(name, runner, priority, EventListener.LIMIT_ONCE)
  }

  /**
   * Register an twice times handler of a specific event
   *
   * @param {!string} name Name of event to listen
   * @param {!function} runner Callback to handle incoming event
   * @param {?number} priority Higher priority handler will be call later than the others
   * @returns {EventListener} EventListener instance of registration
   */
  twice(name, runner, priority) {
    return this.on(name, runner, priority, EventListener.LIMIT_TWICE)
  }

  /**
   * Remove event's listeners
   *
   * @param {string} name Name of event to remove its listeners
   * @param {number} priority Priority of handler to remove. In case this parameter is undefined,
   *                          it will remove all handlers
   * @throws {Error} If name of event is not specified
   */
  off(name, priority) {
    if (priority === undefined) {
      // remove all listeners of event's name
      this.getEvents().set(name, getEventItem())
    } else if (this.getEvents().has(name)) {
      let listeners = this.getEvents().get(name).listeners
      for (let i = 0; i < listeners.length; i++) {
        let listener = listeners[i]
        if (listener.getPriority() === priority) {
          listeners.splice(i, 1)
        }
      }
    } else {
      throw new Exception('[Event/EventManager#off] name must be specified.')
    }
  }

  /**
   * Sort event listeners by priority
   * @see {EventManager.SORT_ASCENDING}
   * @param {!string} name Name of event to sort
   * @param {string} [type='asc'] Sorting type, asc (EventManager.SORT_ASCENDING) or desc (EventManager.SORT_DESCENDING)
   */
  sort(name, type = EventManager.SORT_ASCENDING) {
    let events = this.getEvents().get(name)
    if (events.sorted) {
      return false
    }

    const total = events.listeners.length
    let pos, guard, listener, temporary
    for (let i = 0; i < total - 1; i++) {
      pos = i
      for (let j = i + 1; j < total; j++) {
        guard    = events.listeners[pos]
        listener = events.listeners[j]
        if (type === EventManager.SORT_ASCENDING && guard.priority > listener.priority
          || type === EventManager.SORT_DESCENDING && guard.priority < listener.priority) {
          pos = j
        }
      }

      if (i !== pos) {
        temporary             = events.listeners[i]
        events.listeners[i]   = events.listeners[pos]
        events.listeners[pos] = temporary
      }
    }
  }

  /**
   * Emit (Fire) an event
   *
   * @param {string} name Event's name to be fired
   * @param {Bag|Object} parameters Parameters for event
   * @param {boolean} [series=false] Run listeners in series or parallel
   * @returns {Promise}
   */
  emit(name, parameters = null, series = false) {
    if (!this.getEvents().has(name)) {
      this.getEvents().set(name, getEventItem())
    } else {
      this.sort(name)
    }
    if (parameters === undefined || parameters === null) {
      parameters = new Bag()
    } else if (typeof parameters === 'object') {
      if (!(parameters instanceof Bag)) {
        parameters = new Bag(parameters)
      }
    } else {
      throw new InvalidArgumentException('[Event/EventManager#emit] args must be an instance of Bag or an object')
    }

    let listeners = this.getEvents().get(name).listeners
    const total   = listeners.length
    let parallels = []
    for (let i = 0; i < total; i++) {
      // Set a callback function to allow listener to add its result to final results
      // which is an array and processed as a third parameter after all tasks are run
      parallels.push((next) => listeners[i].getRunner()(parameters, next))
    }

    // run tasks
    return new Promise((resolve, reject) => {
      if (parallels.length) {
        try {
          const args = [parallels, (err, results) => {
            this._onAsyncCompleted(name, err, results)
            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          }]
          if (series === true) {
            async.series.apply(this, args)
          } else {
            async.parallel.apply(this, args)
          }
        } catch (e) {
          reject(e)
        }
      } else {
        resolve()
      }
    })
  }

  /**
   * Handle event when asynchronous calls have been completed
   * @param {string} name Event's name
   * @param {Exception} err A string represent for error
   * @param {Array} results An array of results of tasks
   * @private
   */
  _onAsyncCompleted(name, err, results) {
    let event                  = this.getEvents().get(name),
        listeners              = event.listeners,
        listener = null, limit = null

    for (let i = 0; i < listeners.length; i++) {
      listener = listeners[i], limit = listener.getLimit()

      if (limit !== EventListener.LIMIT_NONE) {
        // reduce listener's limit
        event.listeners[i].setLimit(--limit)
      }

      if (err) {
        // there is an expected error when running tasks in parallel/series
        listener.onError(err)
      } else {
        // it seems to be fine, set results if any to event
        listener.onComplete(results)
      }

      if (limit === 0) {
        // remove this listener
        event.listeners.splice(i, 1)
      }
    }
  }
}
EventManager.SORT_ASCENDING  = 'asc'
EventManager.SORT_DESCENDING = 'desc'

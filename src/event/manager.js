import async from 'async'
import Event from './event'
import Bag from '../foundation/bag'
import EventListener from './listener'
import Exception from '../exception/exception'
import InvalidArgumentException from '../exception/invalid-argument'

/**
 * Handle event when asynchronous calls have been completed
 * @param {Event} event Current running event
 * @param {Exception} err A string represent for error
 * @param {Array} results An array of results of tasks
 */
function onAsyncCompleted(event, err, results) {
  let events = this.getEvents().get(event.getName()),
      listeners = events.listeners,
      listener = null, limit = null

  for (let i = 0; i < listeners.length; i++) {
    listener = listeners[i], limit = listener.getLimit()

    if (limit !== EventListener.LIMIT_NONE) {
      // reduce listener's limit
      events.listeners[i].setLimit(--limit)
    }
    
    if (err) {
      // there is an expected error when running tasks in parallel/series
      event.setError(err)
      listener.onError(event)
    } else {
      // it seems to be fine, set results if any to event
      event.setResults(results)
      listener.onComplete(event)
    }

    if (limit === 0) {
      // remove this listener
      removeEventListener.apply(this, [event.getName(), i])
    }
  }
}

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

/**
 * Remove a listener by name and position
 * @param {string} name Name of event
 * @param {number} position Position of the listener in queue
 */
function removeEventListener(name, position) {
  this.getEvents().get(name).listeners.splice(position, 1)
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

  onComplete(event) {
    if (this._onComplete) {
      this._onComplete(event)
    }
  }

  onError(event) {
    if (this._onError) {
      this._onError(event)
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
          removeEventListener.apply(this, [name, i])
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
        temporary = events.listeners[i]
        events.listeners[i]   = events.listeners[pos]
        events.listeners[pos] = temporary
      }
    }
  }

  /**
   * Emit (Fire) an event
   *
   * @param {Event} event Event to be fired
   * @param {null|function} done A callback when event is emitted
   */
  emit(event, done = null) {
    if (!(event instanceof Event)) {
      throw new Error(`[Event/EventManager#emit] event must be an instance of Event`)
    }
    const name = event.getName()
    if (!this.getEvents().has(name)) {
      this.getEvents().set(name, getEventItem())
    } else {
      this.sort(name)
    }

    let listeners = this.getEvents().get(name).listeners
    const total   = listeners.length
    let parallels = []
    for (let i = 0; i < total; i++) {
      // Set a callback function to allow listener to add its result to final results
      // which is an array and processed as a third parameter after all tasks are run
      parallels.push((callback) => listeners[i].getRunner()(event, callback))
    }

    // run tasks
    if (parallels.length) {
      const onComplete = (err, results) => {
        onAsyncCompleted.apply(this, [event, err, results])
        if (done) done(event)
      }
      if (event.isParallel() === true) {
        async.parallel(parallels, (err, results) => {
          onComplete(err, results)
        })
      } else {
        async.series(parallels, (err, results) => {
          onComplete(err, results)
        })
      }
    } else {
      if (done) done(event)
    }
  }
}
EventManager.SORT_ASCENDING  = 'asc'
EventManager.SORT_DESCENDING = 'desc'

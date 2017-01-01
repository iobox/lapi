'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _listener = require('./listener');

var _listener2 = _interopRequireDefault(_listener);

var _exception = require('../foundation/exception');

var _exception2 = _interopRequireDefault(_exception);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Handle event when asynchronous calls have been completed
 * @param {Event} event Current running event
 * @param {Exception} err A string represent for error
 * @param {Array} results An array of results of tasks
 */
function onAsyncCompleted(event, err, results) {
  var events = this.getEvents().get(event.getName()),
      listeners = events.listeners,
      listener = null,
      limit = null;

  for (var i = 0; i < listeners.length; i++) {
    listener = listeners[i], limit = listener.getLimit();

    if (limit !== _listener2.default.LIMIT_NONE) {
      // reduce listener's limit
      events.listeners[i].setLimit(--limit);
    }

    if (err) {
      // there is an expected error when running tasks in parallel/series
      event.setError(err);
      listener.onError(event);
    } else {
      // it seems to be fine, set results if any to event
      event.setResults(results);
      listener.onComplete(event);
    }

    if (limit === 0) {
      // remove this listener
      removeEventListener.apply(this, [event.getName(), i]);
    }
  }
}

/**
 * Get structure of an event item
 * @param {Array} listeners
 * @param {boolean} sorted
 * @returns {{listeners: Array, sorted: boolean}}
 */
var getEventItem = function getEventItem() {
  var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var sorted = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  return {
    listeners: listeners,
    sorted: sorted
  };
};

/**
 * Remove a listener by name and position
 * @param {string} name Name of event
 * @param {number} position Position of the listener in queue
 */
function removeEventListener(name, position) {
  this.getEvents().get(name).listeners.splice(position, 1);
}

var CallableEventListener = function (_EventListener) {
  _inherits(CallableEventListener, _EventListener);

  function CallableEventListener(runner) {
    var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _listener2.default.PRIORITY_NORMAL;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _listener2.default.LIMIT_NONE;

    _classCallCheck(this, CallableEventListener);

    /**
     * A callback for onComplete
     * @type {null|function}
     * @private
     */
    var _this = _possibleConstructorReturn(this, (CallableEventListener.__proto__ || Object.getPrototypeOf(CallableEventListener)).call(this, runner, priority, limit));

    _this._onComplete = null;

    /**
     * A callback for onError
     * @type {null|function}
     * @private
     */
    _this._onError = null;
    return _this;
  }

  /**
   * Allow to run callback when onComplete is called
   * @param {function} onComplete
   */


  _createClass(CallableEventListener, [{
    key: 'complete',
    value: function complete(onComplete) {
      this._onComplete = onComplete;
    }

    /**
     * Allow to run callback when onError is called
     * @param {function} onError
     */

  }, {
    key: 'error',
    value: function error(onError) {
      this._onError = onError;
    }
  }, {
    key: 'onComplete',
    value: function onComplete(event) {
      if (this._onComplete) {
        this._onComplete(event);
      }
    }
  }, {
    key: 'onError',
    value: function onError(event) {
      if (this._onError) {
        this._onError(event);
      }
    }
  }]);

  return CallableEventListener;
}(_listener2.default);

/**
 * Manage, emit events
 */


var EventManager = function () {
  /**
   * Constructor
   */
  function EventManager() {
    _classCallCheck(this, EventManager);

    /**
     * Registered events
     * @type {Bag}
     * @private
     */
    this._events = new _bag2.default();
  }

  /**
   * Get registered events
   * @returns {Bag}
   */


  _createClass(EventManager, [{
    key: 'getEvents',
    value: function getEvents() {
      return this._events;
    }

    /**
     * Set registered events
     * @param {Object|Bag} events
     * @throws {InvalidArgumentException} throws an exception if events is not an instance of Bag or an object
     */

  }, {
    key: 'setEvents',
    value: function setEvents(events) {
      if (events instanceof _bag2.default) {
        this._events = events;
      } else if ((typeof events === 'undefined' ? 'undefined' : _typeof(events)) === 'object') {
        this._events = new _bag2.default(events);
      } else {
        throw new _invalidArgument2.default('[Event/EventManager#setEvents] events must be an instance of Bag or an object');
      }
    }

    /**
     * Subscribe a listener to Event Manager
     *
     * @param {!string} name Name of event to subscribe
     * @param {!EventListener} listener A listener object to handle incoming event
     * @throws {Exception} throws an exception if listener is not an instance of Event/EventListener
     */

  }, {
    key: 'subscribe',
    value: function subscribe(name, listener) {
      if (!(listener instanceof _listener2.default)) {
        throw new _exception2.default('[Event/EventManager#subscribe] listener must be an instance of Event/EventListener');
      }
      this.on(name, listener.getRunner(), listener.getPriority(), listener.getLimit());
    }

    /**
     * Unsubscribe a listener
     *
     * @param {!string} name Name of event to unsubscribe
     * @param {!EventListener} listener EventListener to unsubscribe
     */

  }, {
    key: 'unsubscribe',
    value: function unsubscribe(name, listener) {
      if (!(listener instanceof _listener2.default)) {
        throw new Error('[Event/EventManager#unsubscribe] listener must be an instance of Event/EventListener');
      }
      this.off(name, listener.getPriority());
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

  }, {
    key: 'on',
    value: function on(name, runner, priority, limit) {
      if (!this.getEvents().has(name)) {
        this.getEvents().set(name, getEventItem());
      }

      var listener = new CallableEventListener(runner, priority, limit);
      this.getEvents().get(name).listeners.push(listener);

      return listener;
    }

    /**
     * Register an one time handler of a specific event
     *
     * @param {!string} name Name of event to listen
     * @param {!function} runner Callback to handle incoming event
     * @param {?number} priority Higher priority handler will be call later than the others
     * @returns {EventListener} EventListener instance of registration
     */

  }, {
    key: 'once',
    value: function once(name, runner, priority) {
      return this.on(name, runner, priority, _listener2.default.LIMIT_ONCE);
    }

    /**
     * Register an twice times handler of a specific event
     *
     * @param {!string} name Name of event to listen
     * @param {!function} runner Callback to handle incoming event
     * @param {?number} priority Higher priority handler will be call later than the others
     * @returns {EventListener} EventListener instance of registration
     */

  }, {
    key: 'twice',
    value: function twice(name, runner, priority) {
      return this.on(name, runner, priority, _listener2.default.LIMIT_TWICE);
    }

    /**
     * Remove event's listeners
     *
     * @param {string} name Name of event to remove its listeners
     * @param {number} priority Priority of handler to remove. In case this parameter is undefined,
     *                          it will remove all handlers
     * @throws {Error} If name of event is not specified
     */

  }, {
    key: 'off',
    value: function off(name, priority) {
      if (priority === undefined) {
        // remove all listeners of event's name
        this.getEvents().set(name, getEventItem());
      } else if (this.getEvents().has(name)) {
        var listeners = this.getEvents().get(name).listeners;
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          if (listener.getPriority() === priority) {
            removeEventListener.apply(this, [name, i]);
          }
        }
      } else {
        throw new _exception2.default('[Event/EventManager#off] name must be specified.');
      }
    }

    /**
     * Sort event listeners by priority
     * @see {EventManager.SORT_ASCENDING}
     * @param {!string} name Name of event to sort
     * @param {string} [type='asc'] Sorting type, asc (EventManager.SORT_ASCENDING) or desc (EventManager.SORT_DESCENDING)
     */

  }, {
    key: 'sort',
    value: function sort(name) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EventManager.SORT_ASCENDING;

      var events = this.getEvents().get(name);
      if (events.sorted) {
        return false;
      }

      var total = events.listeners.length;
      var pos = void 0,
          guard = void 0,
          listener = void 0,
          temporary = void 0;
      for (var i = 0; i < total - 1; i++) {
        pos = i;
        for (var j = i + 1; j < total; j++) {
          guard = events.listeners[pos];
          listener = events.listeners[j];
          if (type === EventManager.SORT_ASCENDING && guard.priority > listener.priority || type === EventManager.SORT_DESCENDING && guard.priority < listener.priority) {
            pos = j;
          }
        }

        if (i !== pos) {
          temporary = events.listeners[i];
          events.listeners[i] = events.listeners[pos];
          events.listeners[pos] = temporary;
        }
      }
    }

    /**
     * Emit (Fire) an event
     *
     * @param {Event} event Event to be fired
     * @param {null|function} done A callback when event is emitted
     */

  }, {
    key: 'emit',
    value: function emit(event) {
      var _this2 = this;

      var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (!(event instanceof _event2.default)) {
        throw new Error('[Event/EventManager#emit] event must be an instance of Event');
      }
      var name = event.getName();
      if (!this.getEvents().has(name)) {
        this.getEvents().set(name, getEventItem());
      } else {
        this.sort(name);
      }

      var listeners = this.getEvents().get(name).listeners;
      var total = listeners.length;
      var parallels = [];

      var _loop = function _loop(i) {
        // Set a callback function to allow listener to add its result to final results
        // which is an array and processed as a third parameter after all tasks are run
        parallels.push(function (callback) {
          return listeners[i].getRunner()(event, callback);
        });
      };

      for (var i = 0; i < total; i++) {
        _loop(i);
      }

      // run tasks
      if (parallels.length) {
        (function () {
          var onComplete = function onComplete(err, results) {
            onAsyncCompleted.apply(_this2, [event, err, results]);
            if (done) done(event);
          };
          if (event.isParallel() === true) {
            _async2.default.parallel(parallels, function (err, results) {
              onComplete(err, results);
            });
          } else {
            _async2.default.series(parallels, function (err, results) {
              onComplete(err, results);
            });
          }
        })();
      } else {
        if (done) done(event);
      }
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;

EventManager.SORT_ASCENDING = 'asc';
EventManager.SORT_DESCENDING = 'desc';
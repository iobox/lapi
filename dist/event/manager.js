'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _listener = require('./listener');

var _listener2 = _interopRequireDefault(_listener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var async = require('async');
var Bag = require('lapi-common').Bag;
var Exception = require('lapi-common').Exception;
var InvalidArgumentException = require('lapi-common').exception.InvalidArgumentException;


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
    value: function onComplete(results) {
      if (this._onComplete) {
        this._onComplete(results);
      }
    }
  }, {
    key: 'onError',
    value: function onError(error) {
      if (this._onError) {
        this._onError(error);
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
    this._events = new Bag();
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
      if (events instanceof Bag) {
        this._events = events;
      } else if ((typeof events === 'undefined' ? 'undefined' : _typeof(events)) === 'object') {
        this._events = new Bag(events);
      } else {
        throw new InvalidArgumentException('[Event/EventManager#setEvents] events must be an instance of Bag or an object');
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
        throw new Exception('[Event/EventManager#subscribe] listener must be an instance of Event/EventListener');
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
     * @param {?number} [priority=null] Higher priority handler will be call later than the others
     * @param {?number} [limit=null] Number of times to be run. Default is null to ignore limit
     * @returns {EventListener} EventListener instance of registration
     */

  }, {
    key: 'on',
    value: function on(name, runner) {
      var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

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
     * @param {?number} [priority=null] Higher priority handler will be call later than the others
     * @returns {EventListener} EventListener instance of registration
     */

  }, {
    key: 'once',
    value: function once(name, runner) {
      var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return this.on(name, runner, priority, _listener2.default.LIMIT_ONCE);
    }

    /**
     * Register an twice times handler of a specific event
     *
     * @param {!string} name Name of event to listen
     * @param {!function} runner Callback to handle incoming event
     * @param {?number} [priority=null] Higher priority handler will be call later than the others
     * @returns {EventListener} EventListener instance of registration
     */

  }, {
    key: 'twice',
    value: function twice(name, runner) {
      var priority = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      return this.on(name, runner, priority, _listener2.default.LIMIT_TWICE);
    }

    /**
     * Remove event's listeners
     *
     * @param {string} name Name of event to remove its listeners
     * @param {?number} [priority=null] Priority of handler to remove. In case this parameter is undefined,
     *                          it will remove all handlers
     * @throws {Error} If name of event is not specified
     */

  }, {
    key: 'off',
    value: function off(name) {
      var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (priority === null) {
        // remove all listeners of event's name
        this.getEvents().set(name, getEventItem());
      } else if (this.getEvents().has(name)) {
        var listeners = this.getEvents().get(name).listeners;
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          if (listener.getPriority() === priority) {
            listeners.splice(i, 1);
          }
        }
      } else {
        throw new Exception('[Event/EventManager#off] name must be specified.');
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
     * @param {string} name Event's name to be fired
     * @param {Bag|Object} parameters Parameters for event
     * @param {boolean} [series=false] Run listeners in series or parallel
     * @returns {Promise}
     */

  }, {
    key: 'emit',
    value: function emit(name) {
      var _this2 = this;

      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var series = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!this.getEvents().has(name)) {
        this.getEvents().set(name, getEventItem());
      } else {
        this.sort(name);
      }
      if (parameters === undefined || parameters === null) {
        parameters = new Bag();
      } else if ((typeof parameters === 'undefined' ? 'undefined' : _typeof(parameters)) === 'object') {
        if (!(parameters instanceof Bag)) {
          parameters = new Bag(parameters);
        }
      } else {
        throw new InvalidArgumentException('[Event/EventManager#emit] args must be an instance of Bag or an object');
      }

      var listeners = this.getEvents().get(name).listeners;
      var total = listeners.length;
      var parallels = [];

      var _loop = function _loop(i) {
        // Set a callback function to allow listener to add its result to final results
        // which is an array and processed as a third parameter after all tasks are run
        parallels.push(function (next) {
          return listeners[i].getRunner()(parameters, next);
        });
      };

      for (var i = 0; i < total; i++) {
        _loop(i);
      }

      // run tasks
      return new Promise(function (resolve, reject) {
        if (parallels.length) {
          try {
            var args = [parallels, function (err, results) {
              _this2._onAsyncCompleted(name, err, results);
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            }];
            if (series === true) {
              async.series.apply(_this2, args);
            } else {
              async.parallel.apply(_this2, args);
            }
          } catch (e) {
            reject(e);
          }
        } else {
          resolve();
        }
      });
    }

    /**
     * Handle event when asynchronous calls have been completed
     * @param {string} name Event's name
     * @param {Exception} err A string represent for error
     * @param {Array} results An array of results of tasks
     * @private
     */

  }, {
    key: '_onAsyncCompleted',
    value: function _onAsyncCompleted(name, err, results) {
      var event = this.getEvents().get(name),
          listeners = event.listeners,
          listener = null,
          limit = null;

      for (var i = 0; i < listeners.length; i++) {
        listener = listeners[i], limit = listener.getLimit();

        if (limit !== _listener2.default.LIMIT_NONE) {
          // reduce listener's limit
          event.listeners[i].setLimit(--limit);
        }

        if (err) {
          // there is an expected error when running tasks in parallel/series
          listener.onError(err);
        } else {
          // it seems to be fine, set results if any to event
          listener.onComplete(results);
        }

        if (limit === 0) {
          // remove this listener
          event.listeners.splice(i, 1);
        }
      }
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;

EventManager.SORT_ASCENDING = 'asc';
EventManager.SORT_DESCENDING = 'desc';
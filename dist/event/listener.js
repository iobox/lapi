'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _event = require('./event');

var _event2 = _interopRequireDefault(_event);

var _exception = require('../foundation/exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Event Listener
 *
 * Process event when it is emitted by the EventManager
 */
var EventListener = function () {
  /**
   * Constructor
   * @param {!function} runner Callback function to process event, it would receive an event as input
   * @param {?number} [priority=5] Determine the order of listener in running queue
   * @param {?number} [limit=null] Define if this listen could only run at a specific times
   */
  function EventListener(runner) {
    var priority = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EventListener.PRIORITY_NORMAL;
    var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EventListener.LIMIT_NONE;

    _classCallCheck(this, EventListener);

    /**
     * @type {function}
     * @private
     */
    this._runner = runner;

    /**
     * @type {number}
     * @private
     */
    this._priority = priority;

    /**
     * @type {number}
     * @private
     */
    this._limit = limit;
  }

  /**
   * Get runner
   * @returns {Function}
   */


  _createClass(EventListener, [{
    key: 'getRunner',
    value: function getRunner() {
      return this._runner;
    }

    /**
     * Set runner
     * @param {Function} runner
     */

  }, {
    key: 'setRunner',
    value: function setRunner(runner) {
      if (typeof runner !== 'function') {
        throw new _exception2.default('[Event/Listener#setRunner] runner must be a function');
      }
      this._runner = runner;
    }

    /**
     * Get limit
     * @returns {number}
     */

  }, {
    key: 'getLimit',
    value: function getLimit() {
      return this._limit;
    }

    /**
     * Set limit
     * @param {number} limit
     */

  }, {
    key: 'setLimit',
    value: function setLimit(limit) {
      this._limit = limit;
    }

    /**
     * Get priority
     * @returns {number}
     */

  }, {
    key: 'getPriority',
    value: function getPriority() {
      return this._priority;
    }

    /**
     * Set priority
     * @param {number} priority
     */

  }, {
    key: 'setPriority',
    value: function setPriority(priority) {
      this._priority = priority;
    }

    /**
     * Callback function to be called right after event is fired and stopped completely
     * @param {Event} event
     */

  }, {
    key: 'onComplete',
    value: function onComplete(event) {}

    /**
     * Callback function to be run if there is an error when processing event
     * @param {Event} event An error may be acquired using event.getError
     */

  }, {
    key: 'onError',
    value: function onError(event) {}
  }]);

  return EventListener;
}();

exports.default = EventListener;

EventListener.LIMIT_NONE = null;
EventListener.LIMIT_ONCE = 1;
EventListener.LIMIT_TWICE = 2;

EventListener.PRIORITY_LOW = 1;
EventListener.PRIORITY_NORMAL = 5;
EventListener.PRIORITY_HIGH = 10;
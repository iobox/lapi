'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _exception = require('../foundation/exception');

var _exception2 = _interopRequireDefault(_exception);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represent for an event emitted by EventManager
 */
var Event = function () {
  /**
   * Constructor
   * @param {string} name Event's name
   * @param {boolean} [parallel=false] Determine whether or not to allow running listeners in parallel
   */
  function Event(name) {
    var parallel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, Event);

    /**
     * Event's name
     * @type {string}
     * @private
     */
    this._name = name;

    /**
     * Define whether or not to run this event's listeners in parallel
     * @type {boolean}
     * @private
     */
    this._parallel = parallel;

    /**
     * Determine whether or not to continue event loop
     * @type {boolean}
     * @private
     */
    this._continue = true;

    /**
     * An error if exists
     * @type {Exception}
     * @private
     */
    this._error = null;

    /**
     * An array contains results when all listeners are run
     * @type {Array}
     * @private
     */
    this._results = [];
  }

  /**
   * ReadOnly name of event
   * @returns {string}
   */


  _createClass(Event, [{
    key: 'getName',
    value: function getName() {
      return this._name;
    }

    /**
     * Stop running event any furthermore
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._continue = false;
    }

    /**
     * Determine if the event is actually stopped or not
     * @returns {boolean}
     */

  }, {
    key: 'isStopped',
    value: function isStopped() {
      return !this._continue;
    }

    /**
     * Tells whether or not this event allow to run in parallel
     * @returns {boolean}
     */

  }, {
    key: 'isParallel',
    value: function isParallel() {
      return this._parallel;
    }

    /**
     * Allow to run in parallel or not
     * @param {boolean} parallel
     */

  }, {
    key: 'parallel',
    value: function parallel(_parallel) {
      this._parallel = _parallel;
    }

    /**
     * Set error
     * @param {Exception|Error} e
     */

  }, {
    key: 'setError',
    value: function setError(e) {
      if (e instanceof Error) {
        e = new _exception2.default(e.message, e.code);
      }

      this._error = e;
    }

    /**
     * Get error
     * @returns {Exception}
     */

  }, {
    key: 'getError',
    value: function getError() {
      return this._error;
    }

    /**
     * Is there an error
     * @returns {boolean}
     */

  }, {
    key: 'hasError',
    value: function hasError() {
      return this._error === null ? false : true;
    }

    /**
     * Get results
     * @returns {Array}
     */

  }, {
    key: 'getResults',
    value: function getResults() {
      return this._results;
    }

    /**
     * Set results
     * @param [Array] results
     */

  }, {
    key: 'setResults',
    value: function setResults(results) {
      this._results = results;
    }
  }]);

  return Event;
}();
/**
 * Name of event
 * Derived class must override this static attribute
 * @type {string}
 */


exports.default = Event;
Event.NAME = '';
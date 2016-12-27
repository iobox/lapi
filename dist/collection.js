'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('assert');

/**
 * Support to manipulate collection of items
 */

var Collection = function () {
  /**
   * Constructor
   * @param {?Array} [items=[]] Initial items to be placed in collection
   */
  function Collection() {
    var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Collection);

    /**
     * @access protected
     * @type {Array}
     */
    this._items = items;
  }

  /**
   * Add an item to collection
   *
   * @param {*} item Add an item to collection, it should have any type as possible
   * @returns {Collection}
   */


  _createClass(Collection, [{
    key: 'add',
    value: function add(item) {
      this._items.push(item);
      return this;
    }

    /**
     * Remove an item (or index) from collection
     *
     * @param {number|Object} item Item to be removed
     */

  }, {
    key: 'remove',
    value: function remove(item) {
      switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
        case 'number':
          this._items.splice(item, 1);
          break;

        case 'object':
        default:
          for (var i = 0; i < this._items.length; i++) {
            try {
              assert.deepEqual(item, this._items[i]);
              this.remove(i);
            } catch (e) {
              // do nothing
            }
          }
          break;
      }
    }

    /**
     * Check whether or not an item exists in collection
     *
     * @param {*} item Item to check
     * @returns {boolean}
     */

  }, {
    key: 'has',
    value: function has(item) {
      if (this._items.length) {
        for (var i = 0; i < this._items.length; i++) {
          switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
            case 'object':
              try {
                assert.deepEqual(item, this._items[i]);
                return true;
              } catch (e) {
                // do nothing
              }
              break;
            default:
              if (item === this._items[i]) {
                return true;
              }
              break;
          }
        }
      }

      return false;
    }

    /**
     * Add an item to collection
     *
     * @see {Collection#add}
     * @param {*} item
     */

  }, {
    key: 'push',
    value: function push(item) {
      this.add(item);
    }

    /**
     * Return last item of collection
     *
     * @returns {*}
     */

  }, {
    key: 'pop',
    value: function pop() {
      return this._items.pop();
    }

    /**
     * Find items by query
     *
     * @param {{}} query
     * @returns {Collection|null}
     */

  }, {
    key: 'find',
    value: function find(query) {
      var keys = Object.keys(query);
      if (keys.length === 0) {
        return null;
      }

      var items = new Collection();
      this._items.forEach(function (item) {
        var isMatched = true;
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (typeof item[key] === 'undefined' || query[key] !== item[key]) {
            isMatched = false;
            break;
          }
        }
        if (isMatched) {
          items.add(item);
        }
      });
      return items;
    }

    /**
     * Get an item by index
     *
     * @param {number} index
     * @param {?*} [def=null] Default result if item could not be found
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(index) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return typeof this._items[index] === 'undefined' ? def : this._items[index];
    }

    /**
     * Replace all current items
     * @param {Array} [items=[]]
     */

  }, {
    key: 'replace',
    value: function replace() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this._items = items;
    }

    /**
     * Get all items in collection
     * @returns {Array}
     */

  }, {
    key: 'all',
    value: function all() {
      return this._items;
    }

    /**
     * Loop through data with a callback
     * @param {function} callback A callback function to handle item,
     *                            it would receive 2 parameters (key, value) as the input
     * @param {?Object} target An object to become 'this argument' (receiver) of the callback
     */

  }, {
    key: 'forEach',
    value: function forEach(callback, target) {
      this._items.forEach(function (item) {
        if (typeof target === 'undefined') {
          callback(item);
        } else {
          callback.apply(target, [item]);
        }
      });
    }
  }]);

  return Collection;
}();

exports.default = Collection;
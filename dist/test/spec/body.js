'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('assert');

var BodySpec = function () {
  function BodySpec() {
    _classCallCheck(this, BodySpec);
  }

  _createClass(BodySpec, [{
    key: 'getBodyContent',

    /**
     * Get Body content
     * @returns {Bag}
     */
    value: function getBodyContent() {
      if (this._responseBodyContent === undefined) {
        this._responseBodyContent = this.getResponse().getBody().getParsedContent();
      }

      return this._responseBodyContent;
    }
  }, {
    key: 'hasBodyParsedContent',
    value: function hasBodyParsedContent(parsedContent) {
      assert.deepEqual(this.getBodyContent().all(), parsedContent, 'BodySpec#hasParsedContent');
    }
  }, {
    key: 'hasPropertyKeyValue',
    value: function hasPropertyKeyValue(key, value) {
      var actual = this.getBodyContent().get(key);
      assert.equal(actual, value, 'Expect "' + key + '" has value equals "' + value + '", but got "' + actual + '"');
    }
  }]);

  return BodySpec;
}();

exports.default = BodySpec;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extension = require('./extension');

var _extension2 = _interopRequireDefault(_extension);

var _bag = require('../../../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommonExtension = function (_QueryExtension) {
  _inherits(CommonExtension, _QueryExtension);

  function CommonExtension() {
    _classCallCheck(this, CommonExtension);

    return _possibleConstructorReturn(this, (CommonExtension.__proto__ || Object.getPrototypeOf(CommonExtension)).apply(this, arguments));
  }

  _createClass(CommonExtension, [{
    key: 'getName',
    value: function getName() {
      return 'http.query.extension.common';
    }
  }, {
    key: 'register',
    value: function register() {
      return ['require', 'allowNull', 'allowEmpty'];
    }

    /**
     * Require field must exist
     * @param {!Bag} query
     * @param {!string} field
     * @param {!boolean} option
     */

  }, {
    key: 'require',
    value: function require(query, field, option) {
      if (option === true && query.has(field) === false) {
        throw new Error(field + ' is required');
      }
    }

    /**
     * Allow field has null value or not
     * @param {!Bag} query
     * @param {!string} field
     * @param {!boolean} option
     */

  }, {
    key: 'allowNull',
    value: function allowNull(query, field, option) {
      if (option === false && query.has(field) === true && query.get(field) === null) {
        throw new Error(field + ' must not be null');
      }
    }

    /**
     * Allow field has empty value or not
     * @param {!Bag} query
     * @param {!string} field
     * @param {!boolean} option
     */

  }, {
    key: 'allowEmpty',
    value: function allowEmpty(query, field, option) {
      if (option === false && query.has(field) === true && query.get(field) === '') {
        throw new Error(field + ' must not be empty');
      }
    }
  }]);

  return CommonExtension;
}(_extension2.default);

exports.default = CommonExtension;
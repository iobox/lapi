'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _bag = require('../foundation/bag');

var _bag2 = _interopRequireDefault(_bag);

var _invalidArgument = require('../exception/invalid-argument');

var _invalidArgument2 = _interopRequireDefault(_invalidArgument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Schema = function (_Bag) {
  _inherits(Schema, _Bag);

  function Schema(data) {
    _classCallCheck(this, Schema);

    var _this = _possibleConstructorReturn(this, (Schema.__proto__ || Object.getPrototypeOf(Schema)).call(this));

    _this.extend(data);
    return _this;
  }

  /**
   * Set key-value
   * @override
   * @param {!string} key
   * @param {?*} value
   */


  _createClass(Schema, [{
    key: 'set',
    value: function set(key, value) {
      if (key === Schema.FUNC_GET || key === Schema.FUNC_SET) {
        value = new _bag2.default(value);
      }
      _get(Schema.prototype.__proto__ || Object.getPrototypeOf(Schema.prototype), 'set', this).call(this, key, value);
    }
  }, {
    key: '$get',
    value: function $get(key, value) {
      if (this.has(key)) {
        if (this.has(Schema.FUNC_GET)) {
          var getter = this.get(Schema.FUNC_GET);
          if (getter.has(key)) {
            value = getter.get(key)(value);
          }
        } else {
          var type = this.get(key);
          switch (type) {
            case Schema.TYPE_INT:
              value = Number.parseInt(value);
              break;
            case Schema.TYPE_FLOAT:
              value = Number.parseFloat(value);
              break;
            default:
              break;
          }
        }
      }
      return value;
    }
  }]);

  return Schema;
}(_bag2.default);

exports.default = Schema;

Schema.KEY = 'key';
Schema.REF = 'ref';
Schema.FUNC_SET = '$set';
Schema.FUNC_GET = '$get';
Schema.TYPE = 'type';
Schema.TYPE_STRING = 'string';
Schema.TYPE_INT = 'integer';
Schema.TYPE_FLOAT = 'float';
Schema.TYPE_BUFFER = 'buffer';
Schema.TYPE_ARRAY = 'array';
Schema.TYPE_DATE = 'date';
Schema.TYPE_DATETIME = 'datetime';
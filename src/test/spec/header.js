var assert = require('assert')
export default class HeaderSpec {
  hasHeaderKey(key) {
    assert(this.getResponse().getHeader().has(key), `hasHeader ${key}`)
  }

  hasHeaderKeyValue(key, value) {
    assert.equal(this.getResponse().getHeader().get(key), value, `hasHeaderKeyValue ${key} => ${value}`)
  }
}
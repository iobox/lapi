var assert = require('assert')
export default class HttpSpec {
  hasStatusCode(statusCode) {
    assert.equal(this.getResponse().getStatusCode(), statusCode, 'HttpSpec#hasStatusCode')
  }
}
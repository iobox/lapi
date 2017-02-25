var assert = require('assert')
export default class BodySpec {
  /**
   * Get Body content
   * @returns {Bag}
   */
  getBodyContent() {
    if (this._responseBodyContent === undefined) {
      this._responseBodyContent = this.getResponse().getBody().getParsedContent()
    }

    return this._responseBodyContent
  }

  hasBodyParsedContent(parsedContent) {
    assert.deepEqual(this.getBodyContent().all(), parsedContent, 'BodySpec#hasParsedContent')
  }

  hasPropertyKeyValue(key, value) {
    const actual = this.getBodyContent().get(key)
    assert.equal(actual, value, `Expect "${key}" has value equals "${value}", but got "${actual}"`)
  }
}
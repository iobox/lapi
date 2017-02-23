var assert = require('assert')
export default class BodySpec {
  hasBodyParsedContent(parsedContent) {
    assert.deepEqual(this.getResponse().getBody().getParsedContent().all(), parsedContent, 'BodySpec#hasParsedContent')
  }
}
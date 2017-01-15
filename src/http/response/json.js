import Body from '../body'
import Response from './response'
export default class JsonResponse extends Response {
  constructor(data = {}, statusCode = Response.HTTP_OK, header = {}) {
    super('', statusCode, header)
    this.setContent(data)
  }

  /**
   * Set content
   * @param {Object} content
   */
  setContent(content) {
    this.getBody().setContentType(Body.CONTENT_JSON)
    this.getBody().setContent(JSON.stringify(content))
  }

  /**
   * Get content
   * @returns {Object}
   */
  getContent() {
    return this.getBody().getParsedContent()
  }
}
import HttpException from './http'
import Response from '../response'

export default class NotFoundException extends HttpException {
  constructor(message = '', code = null, statusCode = Response.HTTP_NOT_FOUND) {
    super(message, code, statusCode)
  }
}
import HttpException from './http'
import Response from '../response/response'

export default class InvalidArgumentException extends HttpException {
  constructor(message = '', code = null, statusCode = Response.HTTP_INTERNAL_ERROR) {
    super(message, code, statusCode)
  }
}
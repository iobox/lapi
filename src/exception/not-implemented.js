import Exception from './exception'

export default class NotImplementedException extends Exception {
  constructor(message = null, code = null) {
    super(message || 'A requested method or operation is not implemented', code)
  }
}
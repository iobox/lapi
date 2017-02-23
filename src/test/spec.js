import Response from '../http/response'
import Base from '../utility/base'
import HeaderSpec from './spec/header'
import BodySpec from './spec/body'
import HttpSpec from './spec/http'
import InvalidArgumentException from '../exception/invalid-argument'

export default class Spec {
  constructor(response) {
    this._response = response

    Base.from(this).uses([HeaderSpec], [BodySpec], [HttpSpec])
  }

  getResponse() {
    return this._response
  }

  setResponse(response) {
    if (response instanceof Response) {
      this._response = response
    } else {
      throw new InvalidArgumentException('[test.I#setResponse] response must be an instance of Response')
    }
  }
}
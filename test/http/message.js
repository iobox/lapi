var expect = require('chai').expect
import Message from '../../src/http/message'
import Header from '../../src/http/header'
import Body from '../../src/http/body'

/** @test {Message} */
describe('http/message.js',() => {
  let message
  beforeEach(() => {
    message = new Message()
  })

  /** @test {Message#getHeader} */
  it('[getHeader] should return an instance of Header', () => {
    expect(message.getHeader()).to.be.an.instanceof(Header)
  })

  /** @test {Message#getBody} */
  it('[getBody] should return an instance of Body', () => {
    expect(message.getBody()).to.be.an.instanceof(Body)
  })
})

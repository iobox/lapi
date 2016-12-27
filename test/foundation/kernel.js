import Kernel from '../../src/foundation/kernel'
import Container from '../../src/foundation/container'
var expect = require('chai').expect

/** @test {Kernel} */
describe('kernel.js', function() {
  let kernel
  beforeEach(function() {
    kernel = new Kernel()
  })

  /** @test {Kernel#getContainer} */
  it('[getContainer] should return an instanceof Container', () => {
    expect(kernel.getContainer()).to.be.an.instanceof(Container)
  })

  /** @test {Kernel#setContainer} */
  it('[setContainer] should allow to set a container', () => {
    expect(() => {kernel.setContainer({})}).to.throw(Error)

    const container = new Container()
    container.set('db', 'db-instance')
    kernel.setContainer(container)
    expect(kernel.getContainer()).to.deep.equal(container)
  })
})
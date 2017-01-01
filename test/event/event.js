import Event from '../../src/event/event'
var expect = require('chai').expect

/** @test {Event} */
describe('event/event.js', () => {
  let event = new Event()
  beforeEach(() => {event = new Event()})

  /** @test {Event#getName} */
  it('[getName] should return event\'s name', () => {
    event = new Event('my_event')
    expect(event.getName()).to.equal('my_event')
  })

  /** @test {Event#stop} */
  it('[stop] should stop the event by setting continue property to false', () => {
    expect(event.isStopped()).to.be.false
    event.stop()
    expect(event.isStopped()).to.be.true
  })

  /** @test {Event#isStopped} */
  it('[isStopped] should be false at the first and true in latter', () => {
    expect(event.isStopped()).to.be.false
    event._continue = false
    expect(event.isStopped()).to.be.true
  })
})

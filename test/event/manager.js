import Event from '../../src/event/event'
import EventManager from '../../src/event/manager'
import EventListener from '../../src/event/listener'
var expect = require('chai').expect

/** @test {EventManager} */
describe('event/manager.js', () => {
  let em,
      event,
      name = 'event_name',
      func = (e, done) => {done()},
      listener
  
  beforeEach(() => {
    em = new EventManager()
    event = new Event(name)
    listener = new EventListener(func)
  })

  /** @test {EventManager#on} */
  it('[on] should allow to register an event listener', () => {
    expect(em.getEvents().all()).to.deep.equal({})
    em.on(name, func)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    expect(em.getEvents().get(name).sorted).to.be.false
  })

  /** @test {EventManager#off} */
  it('[off] should allow to remove an event listener', () => {
    expect(em.getEvents().all()).to.deep.equal({})
    em.on(name, func)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)

    em.off(name)
    expect(em.getEvents().get(name).listeners.length).to.equal(0)

    em.on(name, func, 10)
    em.on(name, func, 15)
    expect(em.getEvents().get(name).listeners.length).to.equal(2)
    em.off(name, 15)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
  })

  /** @test {EventManager#emit} */
  it('[emit] should ring the bell', () => {
    let bell = {ring: false}
    em.on(name, (e) => {e.bell.ring = true})
    event.bell = bell
    em.emit(event)
    expect(bell.ring).to.be.true
  })

  /** @test {EventManager#emit} */
  it('[emit] run in parallel', () => {
    event.parallel(true)
    event.tasks = []
    em.on(name, (e, done) => {
      setTimeout(() => {
        e.tasks.push(300)
        done()
      }, 50)
    }).complete((e) => {
      expect(e.tasks).to.deep.equal([100, 300])
    })

    em.once(name, (e, done) => {
      e.tasks.push(100)
      done()
    })

    em.emit(event)
  })

  it('[emit] run in series', () => {
    event.parallel(false)
    event.tasks = []
    em.on(name, (e, done) => {
      setTimeout(() => {
        e.tasks.push(300);
        done()
      }, 150)
    }).complete((e) => {
      expect(e.tasks).to.deep.equal([300, 100])
    })
  
    em.once(name, (e, done) => {
      setTimeout(() => {
        e.tasks.push(100);
        done()
      }, 50)
    })
  
    em.emit(event)
  })

  /** @test {EventManager#once} */
  it('[once] should register listener to run at once', () => {
    em.once(name, func)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    em.emit(event)
    expect(em.getEvents().get(name).listeners.length).to.equal(0)
  })

  /** @test {EventManager#twice} */
  it('[twice] should register listener to run twice', () => {
    em.twice(name, func)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    em.emit(event)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    em.emit(event)
    expect(em.getEvents().get(name).listeners.length).to.equal(0)
  })

  /** @test {EventManager#subscribe} */
  it('[subscribe] should allow to subscribe a listener', () => {
    em.subscribe(name, listener)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    expect(em.getEvents().get(name).sorted).to.be.false
  })

  /** @test {EventManager#unsubscribe} */
  it('[unsubscribe] should allow to unsubscribe a listener', () => {
    em.subscribe(name, listener)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)

    em.unsubscribe(name, listener)
    expect(em.getEvents().get(name).listeners.length).to.equal(0)
  })
})
var expect = require('chai').expect
var assert = require('assert')
import EventManager from '../../src/event/manager'
import EventListener from '../../src/event/listener'

/** @test {EventManager} */
describe('event/manager.js', () => {
  let em,
      name = 'event_name',
      func = (args, next) => {next()},
      listener
  
  beforeEach(() => {
    em = new EventManager()
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
  it('[emit] should ring the bell', (done) => {
    let bell = {ring: false}
    em.on(name, (args, next) => {
      args.get('bell').ring = true
      next()
    })
    em.emit(name, {'bell' : bell})
      .then(() => {
        expect(bell.ring).to.be.true
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

  /** @test {EventManager#emit} */
  it('[emit] run in parallel', (done) => {
    let tasks = []
    em.on(name, (args, next) => {
      setTimeout(() => {
        args.get('tasks').push(300)
        next()
      }, 50)
    }).complete(() => {
      expect(tasks).to.deep.equal([100, 300])
      done()
    })

    em.once(name, (args, next) => {
      args.get('tasks').push(100)
      next()
    })

    em.emit(name, {tasks: tasks}, false)
  })

  /** @test {EventManager#emit} */
  it('[emit] run in series', (done) => {
    let tasks = []
    em.on(name, (args, next) => {
      setTimeout(() => {
        args.get('tasks').push(300)
        next()
      }, 150)
    }).complete(() => {
      expect(tasks).to.deep.equal([300, 100])
      done()
    })
  
    em.once(name, (args, next) => {
      setTimeout(() => {
        args.get('tasks').push(100);
        next()
      }, 50)
    })
  
    em.emit(name, {tasks: tasks}, true)
  })

  /** @test {EventManager#once} */
  it('[once] should register listener to run at once', () => {
    em.once(name, func)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    em.emit(name)
    expect(em.getEvents().get(name).listeners.length).to.equal(0)
  })

  /** @test {EventManager#twice} */
  it('[twice] should register listener to run twice', () => {
    em.twice(name, func)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    em.emit(name)
    expect(em.getEvents().get(name).listeners.length).to.equal(1)
    em.emit(name)
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
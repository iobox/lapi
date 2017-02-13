import Container from '../../src/di/container'
var expect = require('chai').expect

describe('di/container.js', () => {
  let container
  beforeEach(() => {
    container = new Container()
  })

  it('[has] allow to check if a name is already registered', () => {
    container.set('a', 'b')
    expect(container.has('a')).to.be.true
  })

  describe('[get]', () => {
    it('should allow to get value by name', () => {
      container.set('a', 1988)
      expect(container.get('a')).to.equal(1988)
    })
    it('should allow to get instance with constructor arguments', () => {
      class Foo {
        constructor(x, y) {
          this.x = x
          this.y = y
        }
      }
      container.set('foo', Foo, false)
      const m = 5, n = 7
      let foo = container.get('foo', m, n)
      expect(foo).to.be.an.instanceOf(Foo)
      expect(foo.x).to.equal(m)
      expect(foo.y).to.equal(n)
    })
  })

  describe('[set]', () => {
    it('should allow to set (register) a name-value', () => {
      container.set('foo', 'baz')
      expect(container.get('foo')).to.equal('baz')
    })

    it('should allow to share a name-value', () => {
      container.set('foo', 'baz', true)
      expect(container.get('foo')).to.equal('baz')
    })
  })

  describe('[share]', () => {
    it('should allow to share an object', () => {
      let foo = {x: 5}
      container.set('foo', foo, true)
      container.get('foo').x = 6
      expect(foo.x).to.equal(6)
    })
    it('should allow to mark an object as private', () => {
      let foo = {x: 5}
      container.set('foo', foo, false)
      container.get('foo').x = 6
      expect(foo.x).to.equal(5)
    })
  })
})
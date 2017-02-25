import Base from "../../src/util/Base"
var expect = require("chai").expect

/** @test {use} */
describe("use.js", function() {
  class Foo {
    constructor() {}
    bar() { return 'FOO->BAR'}
  }
  it("it should allow to use methods from class", () => {
    class Bar {
      constructor() {
        Base.from(this).use(Foo)
      }
    }
    const bar = new Bar()
    expect(typeof bar['bar'] === 'function').to.be.true
    expect(bar.bar()).to.equal('FOO->BAR')
  })
  it("it should allow to use methods from class with names are changed", () => {
    class Bar {
      constructor() {
        Base.from(this).use(Foo, {bar: 'baz'})
      }
    }
    const bar = new Bar()
    expect(typeof bar['bar'] === 'function').to.be.false
    expect(typeof bar['baz'] === 'function').to.be.true
    expect(bar.baz()).to.equal('FOO->BAR')
  })
  it("it should allow to use methods from multiple classes", () => {
    class Baz {
      baz() {return 'BAZ'}
    }
    class Bar {
      constructor() {
        Base.from(this).uses([Foo, {bar: 'foo'}], [Baz], [Baz, {baz: 'baz2'}])
      }
    }
    const bar = new Bar()
    expect(typeof bar['bar'] === 'function').to.be.false
    expect(typeof bar['foo'] === 'function').to.be.true
    expect(typeof bar['baz'] === 'function').to.be.true
    expect(typeof bar['baz2'] === 'function').to.be.true
  })
})

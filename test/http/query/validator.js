var expect = require('chai').expect
import Validator from '../../../src/http/query/validator'
import Request from '../../../src/http/request'
import Bag from '../../../src/bag'
import ExtensionManager from '../../../src/foundation/extension/manager'

/** @test {Validator} */
describe('http/query/validator.js', () => {
  let validator
  beforeEach(() => {
    validator = new Validator()
  })

  /** @test {Validator#getRequest} */
  it('[getRequest] should return an instance of Request', () => {
    expect(validator.getRequest()).to.be.an.instanceOf(Request)
  })

  /** @test {Validator#setRequest} */
  it('[setRequest] should allow to set a request', () => {
    expect(() => {validator.setRequest({})}).to.throw(Error)

    const request = new Request()
    request.set('attr', 'value')
    validator.setRequest(request)
    expect(validator.getRequest()).to.deep.equal(request)
  })

  /** @test {Validator#getRules} */
  it('[getRules] should return an instance of Bag', () => {
    expect(validator.getRules()).to.be.an.instanceOf(Bag)
  })

  /** @test {Validator#setRules} */
  it('[setRules] should allow to set rules', () => {
    expect(() => {validator.setRules('')}).to.throw(Error)

    let rules = new Bag({'attr': 'value'})
    validator.setRules(rules)
    expect(validator.getRules()).to.deep.equal(rules)

    rules = {'another-attr': 'value'}
    validator.setRules(rules)
    expect(validator.getRules().all()).to.deep.equal(rules)
  })

  /** @test {Validator#getExtensionManager} */
  it('[getExtensionManager] should return an instance of ExtensionManager', () => {
    expect(validator.getExtensionManager()).to.be.an.instanceOf(ExtensionManager)
  })

  /** @test {Validator#setExtensionManager} */
  it('[setExtensionManager] should allow to set ExtensionManager', () => {
    const em = new ExtensionManager()
    validator.setExtensionManager(em)
    expect(validator.getExtensionManager()).to.deep.equal(em)
  })

  /** @test {Validator#all} */
  it('[all] should return an object', () => {
    validator._attributes = new Bag({attr: 'value'})
    expect(validator.all()).to.deep.equal({attr: 'value'})
  })

  /** @test {Validator#only} */
  it('[only] should return an object', () => {
    validator._attributes = new Bag({attr: 'value', attr1: 'value'})
    expect(validator.only(['attr'])).to.deep.equal({attr: 'value'})
  })

  /** @test {Validator#get} */
  it('[get] should return an appropriate value', () => {
    validator._attributes = new Bag({attr: 'value', attr1: 'value'})
    expect(validator.get('attr')).to.equal('value')
  })

  /** @test {Validator#set} */
  it('[set] should allow to set a rule', () => {
    validator.set('name', {require: true})
    expect(validator.getRules().all()).to.deep.equal({'name': {require: true}})

    validator.set('name', {allowNull: false})
    expect(validator.getRules().all()).to.deep.equal({'name': {require: true, allowNull: false}})
  })

  /** @test {Validator#delete} */
  it('[delete] should allow to delete a rule', () => {
    validator.set('name', {require: true})
    validator.set('another', {require: true, allowNull: true})

    validator.delete('name')
    expect(validator.getRules().all()).to.deep.equal({'another': {require: true, allowNull: true}})

    validator.delete('another', 'require')
    expect(validator.getRules().all()).to.deep.equal({'another': {allowNull: true}})
  })

  /** @test {Validator#execute} */
  it('[execute] execute and build attributes', () => {
    expect(validator.execute()).to.deep.equal(validator)
  })
})

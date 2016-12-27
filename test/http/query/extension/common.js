var expect = require('chai').expect
import CommonExtension from '../../../../src/http/query/extension/common'
import Bag from '../../../../src/bag'

/** @test {CommonExtension} */
describe('http/query/extension/common.js', () => {
  let validator
  beforeEach(() => {
    validator = new CommonExtension()
  })

  /** @test {CommonExtension#register} */
  it('[register] should return an array', () => {
    expect(validator.register()).to.deep.equal([
      'require',
      'allowNull',
      'allowEmpty'
    ])
  })

  /** @test {CommonExtension#require} */
  it('[require] should verify if a field exists', () => {
    const query = new Bag({
      field: 'value'
    })
    expect(() => {validator.require(query, 'invalid_field', true)}).to.throw(Error)
    expect(() => {validator.require(query, 'field', true)}).not.to.throw(Error)
  })

  /** @test {CommonExtension#allowNull} */
  it('[require] should verify if a field is null', () => {
    const query = new Bag({
      field: null,
      another_field: null
    })
    expect(() => {validator.allowNull(query, 'field', true)}).not.to.throw(Error)
    expect(() => {validator.allowNull(query, 'another_field', false)}).to.throw(Error)
  })

  /** @test {CommonExtension#allowEmpty} */
  it('[require] should verify if a field is empty', () => {
    const query = new Bag({
      field: '',
      another_field: ''
    })
    expect(() => {validator.allowEmpty(query, 'field', true)}).not.to.throw(Error)
    expect(() => {validator.allowEmpty(query, 'another_field', false)}).to.throw(Error)
  })
})

var expect = require('chai').expect
import Header from '../../lib/http/header'

/** @test {Header} */
describe('http/header.js', () => {
  const data  = {
    'content-Type': 'application/json',
    'Cache-control': 'no-cache'
  }
  let header
  beforeEach(() => {
    header = new Header(data)
  })

  /** @test {Header.keys} */
  it('[get keys] should return keys in upperCase format', () => {
    expect(header.keys).to.deep.equal(['Content-Type', 'Cache-Control'])
  })

  /** @test {Header#has} */
  it('[has] should return true', () => {
    expect(header.has('CONTENT-TYPE')).to.be.true
  })

  /** @test {Header#get} */
  it('[get] should return application/json, and no-cache', () => {
    expect(header.get('CONTENT-type')).to.equal('application/json')
    expect(header.get('cache-CONTRol')).to.equal('no-cache')
  })

  /** @test {Header#set} */
  it('[set] should set a key in lowercase with value', () => {
    header.set('soMe-KEY', true)
    expect(header.get('some-key')).to.be.true
  })

  /** @test {Header#set} */
  it('[set] should set a key in lowercase with value', () => {
    header.set('soMe-KEY', true)
    expect(header.get('some-key')).to.be.true
    header.delete('soMe-KEY')
    expect(header.get('some-key')).to.be.null
  })

  /** @test {Header#all} */
  it('[all] should return all data, but returned data would have all keys in upper-case first', () => {
    header.set('soMe-KEY', true)
    header.set('Some-another-Key', false)
    expect(header.all()).to.deep.equal({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Some-Key': true,
      'Some-Another-Key': false
    })
  })

  /** @test {Header#only} */
  it('[only] should return same as [all], but only some specific keys', () => {
    header.set('soMe-KEY', true)
    header.set('Some-another-Key', false)
    expect(header.only(['Some-Key', 'Some-another-key'])).to.deep.equal({
      'Some-Key': true,
      'Some-Another-Key': false
    })
  })
})

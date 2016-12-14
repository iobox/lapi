import Bag from '../../lib/bag'
import Request from '../../lib/http/request'
var expect = require('chai').expect

/** @test {Request} */
describe('http/request.js',() => {
  let request
  beforeEach(() => {
    request = new Request()
  })

  /** @test {Request.setQuery} */
  it('[setQuery] should allow to set query', () => {
    // set query as a string
    let str = '?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=cookie%20nodejs'
    request.setQuery(str)
    expect(parseInt(request.getQuery().get('ion'))).to.equal(1)

    let uri = `https://www.google.com.vn/webhp?${str}`
    request.setQuery(uri)
    expect(parseInt(request.getQuery().get('ion'))).to.equal(1)

    request.setQuery({ion: 2})
    expect(parseInt(request.getQuery().get('ion'))).to.equal(2)
  })

  /** @test {Request.getQuery} */
  it('[getQuery] should return an instance of Bag', () => {
    expect(request.getQuery()).to.be.an.instanceof(Bag)
  })

  /** @test {Request.getServer} */
  it('[getServer] should return an instance of Bag', () => {
    expect(request.getServer()).to.be.an.instanceof(Bag)
  })

  /** @test {Request.setServer} */
  it('[setServer] should allow to set some properties', () => {
    try {
      request.setServer('some-string')
    } catch (e) {
      expect(e).to.be.an.instanceof(Error)
    }

    const data = {some_value: true}
    request.setServer(data)
    expect(request.getServer().all()).to.deep.equal(data)
  })

  /** @test {Request.getClient} */
  it('[getClient] should return an instance of Bag', () => {
    expect(request.getClient()).to.be.an.instanceof(Bag)
  })

  /** @test {Request.setClient} */
  it('[setClient] should allow to set some properties', () => {
    try {
      request.setClient('some-string')
    } catch (e) {
      expect(e).to.be.an.instanceof(Error)
    }

    const data = {some_value: true}
    request.setClient(data)
    expect(request.getClient().all()).to.deep.equal(data)
  })

  /** @test {Request.getMethod} */
  it('[getMethod] should return a string represents for request\'s method', () => {
    expect(request.getMethod()).to.equal('GET')
  })

  /** @test {Request.setMethod} */
  it('[setMethod] should allow to set method of request', () => {
    request.setMethod(Request.METHOD_POST)
    expect(request.getMethod()).to.equal(Request.METHOD_POST)
  })

  /** @test {Request.getUri} */
  it('[getUri] should return an instance of Bag', () => {
    expect(request.getUri()).to.be.an.instanceof(Bag)
  })

  /** @test {Request.setUri} */
  it('[setUri] should allow to set uri of request', () => {
    const uri = 'https://google.com:9090/auth/sign-in/?authorize_key=abcd&ids[]=1&ids[]=188&ids[]=29&username=long.do#hash'
    request.setUri(uri)
  })

  /** @test {Request.from} */
  it('[from] should return a valid request instance', () => {
    const resource = {
      rawHeaders: [ 'Host',
        'localhost:8000',
        'Connection',
        'keep-alive',
        'Cache-Control',
        'no-cache',
        'User-Agent',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
        'Postman-Token',
        'cde33caa-d307-9716-7775-18acc8c8540f',
        'Accept',
        '*/*',
        'Accept-Encoding',
        'gzip, deflate, sdch, br',
        'Accept-Language',
        'en-US,en;q=0.8,vi;q=0.6' ],
      url: '/?authorize_key=abcd&ids[]=1&ids[]=188&ids[]=29&username=long.do'
    }
    request = Request.from(resource)
    expect(request).to.be.an.instanceof(Request)

    // Test against header
    expect(request.getHeader().get('host')).to.equal('localhost:8000')

    // Test against query
    expect(request.getQuery().get('authorize_key')).to.equal('abcd')
  })
})

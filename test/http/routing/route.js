import Route from '../../../lib/http/routing/route'
import Bag from '../../../lib/bag'
import Request from '../../../lib/http/request'
var expect = require('chai').expect

describe('http/routing/route.js', () => {
  let route
  beforeEach(() => {
    route = new Route()
  })

  it('[getOptions] should return an instance of Bag', () => {
    expect(route.getOptions() instanceof Bag).to.be.true
  })

  it('[setOptions] should allow to set options', () => {
    let options = {hello: 'World'}

    route.setOptions(options)
    expect(route.getOptions().get('hello')).to.equal('World')

    options = new Bag(options)
    route.setOptions(options)
    expect(route.getOptions().get('hello')).to.equal('World')
  })

  it('[preMatch] should perform pre-scanning for demands', () => {
    route.setHost('{country}.domain.com')
    route.setPath('/accounts/{id}-{name}')
    route.setRequirements({
      id: /\d+/,
      name: '[a-zA-Z]+',
      country: /^[a-z]{2}/
    })
    route.preMatch()
    expect(route.getMatches()).to.deep.equal({country: null, id: null, name: null})
  })

  it('[postMatch] should reset host, path', () => {
    route._reservedHost = 'sample'
    route._reservedPath = 'sample'
    route.postMatch()
    expect(route.getHost()).to.equal('sample')
    expect(route.getPath()).to.equal('sample')
    expect(route._reservedHost).to.be.null
    expect(route._reservedPath).to.be.null
  })

  it('[match] should return false at the first, and true in the latter', () => {
    route.setHost('{country}.domain.com')
    route.setPath('/accounts/{id}-{name}')
    route.setRequirements({
      id: /\d+/,
      name: '[a-zA-Z]+',
      country: /[a-z]{2}/
    })
    let request = new Request()
    request.setUri('/accounts/1988-longdo')
    request.setMethod('GET')

    request.getUri().set(Request.URI_HOST, 'vn1.domain.com')
    expect(route.match(request)).to.be.false

    request.getUri().set(Request.URI_HOST, 'vn.domain.com')
    expect(route.match(request)).to.be.true
    expect(route.getMatches()).to.deep.equal({id: '1988', name: 'longdo', country: 'vn'})
  })

  it('[match] should allow to match even if host or port is null', () => {
    route.setName('route_without_host_and_port')
    route.setHost(null)
    route.setPort(null)
    route.setPath('/accounts/{gender}/{id}-{name}')

    let request = new Request()
    request.getUri().set(Request.URI_HOST, 'localhost')
    request.getUri().set(Request.URI_PATH, '/accounts/male/1988-longdo')
    request.setMethod(Request.METHOD_GET)

    expect(route.match(request)).to.be.true
    expect(route.getMatches()).to.deep.equal({id: '1988', name: 'longdo', 'gender': 'male'})

    route.setName('route_without_port')
    route.setHost('localhost')
    expect(route.match(request)).to.be.true
  })
})
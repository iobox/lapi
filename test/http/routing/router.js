import Router from '../../../src/http/routing/router'
import Route from '../../../src/http/routing/route'
import Request from '../../../src/http/request'
var expect = require('chai').expect

describe('http/routing/router.js', () => {
  let router, route, name, path
  beforeEach(() => {
    name = 'home'
    path = '/my-path'
    router = new Router()
    route = new Route(Request.METHOD_POST, path)
    route.setName(name)
    route.setAttributes({controller: function() {}})
  })

  it('[add] should allow to add a new route', () => {
    expect(router.length).to.equal(0)
    router.add(route)
    expect(router.length).to.equal(1)

    router.add({name: 'another', path: '/my-path', attributes: {controller: function() {}}})
    expect(router.length).to.equal(2)
  })

  it('[has] should return false at first, and true on latter call', () => {
    expect(router.has(name)).to.be.false
    router.add(route).name(name)
    expect(router.has(name)).to.be.true
  })

  it('[remove] should allow to remove a specific route by name', () => {
    router.add(route)
    expect(router.has(name)).to.be.true
    router.remove(name)
    expect(router.has(name)).to.be.false
  })
  
  it('[route] should return appropriate route', () => {
    let request = new Request()
    request.getUri().set(Request.URI_HOST, 'vn.domain.com')
    request.getUri().set(Request.URI_PATH, '/accounts/1988-john')
    let route_1 = Route.from({
      name: 'user_account_id',
      host: '{country}.domain.com',
      path: '/accounts/{id}',
      requirements: {
        id: /\d+/
      },
      attributes: {
        controller: function() {}
      }
    })
    let route_2 = Route.from({
      name: 'user_account_name',
      host: '{country}.domain.com',
      path: '/accounts/{id}-{name}',
      requirements: {
        id: /\d+/
      },
      attributes: {
        controller: function() {}
      }
    })
    router.add(route_1)
    router.add(route_2)
    route = router.route(request)
    expect(route.getName()).to.equal('user_account_name')
    expect(route.getMatches()).to.deep.equal({
      country: 'vn',
      id: '1988',
      name: 'john'
    })
    expect(request.getAttributes().all()).to.deep.equal({
      country: 'vn',
      id: '1988',
      name: 'john'
    })
  })
})
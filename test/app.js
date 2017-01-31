import App from '../src/app'
import ModuleExtension from '../src/foundation/extension/module'
import JsonResponse from '../src/http/response/json'
import Route from '../src/http/routing/route'
import Request from '../src/http/request'
import Response from '../src/http/response'
var expect = require('chai').expect
var http = require('http')

/** @test {App} */
describe('app.js', () => {
  let app, config = {
    'server.port': 8080
  }, host = 'http://localhost:8080'
  beforeEach(() => {
    app = new App()
  })
  afterEach(() => {
    if (app instanceof App) {
      app.stop()
    }
  })

  describe('ModuleExtension', () => {
    let flag = false
    it('it should allow to extend with a module based extension', () => {
      class MyExtension extends ModuleExtension {
        getName() {
          return 'my.module'
        }

        setUp() {
          let events = this.getContainer().get('foundation.app.events')
          events.on('http.server.ready', (args, next) => {
            flag = true
            next()
          })
        }
      }
      app.extend(new MyExtension())
      return app.start(config).then(() => {
        expect(flag).to.be.true
      })
    })
  })

  describe('Middleware', () => {
    it('should run middleware with route and request as input arguments', (done) => {
      let error = null
      app.use('auth', (route, request) => {
        try {
          expect(route).to.be.an.instanceof(Route)
          expect(request).to.be.an.instanceof(Request)
        } catch (e) {
          error = e
        }
        return new JsonResponse({
          error: "Authentication is required"
        }, 400)
      })
      app.start(config).then(() => {
        app.getRouter().get('/hello').middleware(['auth'])
        http.get(`${host}/hello`, (res) => {
          Response.from(res).then((response) => {
            expect(response).to.be.an.instanceof(Response)
            expect(response.getHeader().get('content-type')).to.equal('application/json')
            expect(response.getBody().getParsedContent().all()).to.deep.equal({
              error: "Authentication is required"
            })
            expect(response.getStatusCode()).to.equal(400)
            done(error)
          }).catch(e => done(e))
        })
      })
    })
  })
})
var expect = require('chai').expect
const JsonResponse = require('lapi-http').response.JsonResponse
const Route = require('lapi-http').routing.Route
const Request = require('lapi-http').Request
const Api = require('lapi-test').Api
import App from '../src/app'

/** @test {App} */
describe('app.js', () => {
  let app, config = {
    'server.port': 6767
  }, api
  beforeEach(() => {
    app = new App()
    api = new Api({
      host: 'localhost',
      port: 6767
    })
  })
  afterEach(() => {
    if (app instanceof App) {
      app.stop()
    }
  })

  describe('Events', () => {
    it('should print a message when application is ready', () => {
      var message = null
      app.getEvents().on('http.server.ready', (args, next) => {
        message = 'Server is ready! at ' + args.get('host') + ':' + args.get('port')
        next()
      })
      return app.start(config).then(() => {
        expect(message).to.be.not.nul
      })
    })
  })

  describe('Middleware', () => {
    it('should run middleware with route and request as input arguments', (done) => {
      let error = null
      app.getRouter().use('auth', (route, request) => {
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
        api.get('/hello').then(spec => {
          spec.hasHeaderKeyValue('content-type', 'application/json')
          spec.hasBodyParsedContent({
            error: "Authentication is required"
          })
          spec.hasStatusCode(400)
          done(error)
        }).catch(e => done(e))
      })
    })
  })

  describe('Test multiple requests', () => {
    it('should perform multiple POST requests with provided attributes', (done) => {
      app.start(config).then(() => {
        app.getRouter().post('/users').handler(function() {
          return this.getRequest().getBody().getParsedContent().all()
        })
        api.post('/users', {
          name: "<name>",
          role: "<role>",
          company: "ABC"
        }).with({
          name: ["Tony", "Bill"],
          role: ["Boss", "Developer"]
        }).then(spec => {
          spec.hasPropertyKeyValue('name', spec.get('name'))
          spec.hasPropertyKeyValue('role', spec.get('role'))
          spec.hasPropertyKeyValue('company', "ABC")
        }).catch(e => done(e)).done(() => {done()})
      })
    })
  })
})
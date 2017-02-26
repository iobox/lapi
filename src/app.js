import Bag from './foundation/bag'
import ContainerAware from './di/container-aware'
import Router from './http/routing/router'
import EventManager from './event/manager'
import EmptyLogger from './logger/empty'
import LoggerInterface from './logger/interface'
import Request from './http/request'
import Header from './http/header'
import Route from './http/routing/route'
import Controller from './http/controller'
import JsonResponse from './http/response/json'
import Response from './http/response'
import Exception from './exception'
import HttpException from './http/exception/http'
import InternalErrorException from './exception/internal-error'
import NotFoundException from './http/exception/not-found'

const http  = require('http')
const https = require('https')
const fs    = require('fs')

/**
 * Contain information about original request, response
 */
class Connection {
  constructor(req, res) {
    this.req = req
    this.res = res
  }
}

export default class App extends ContainerAware {
  /**
   * Constructor
   * @param {Object} [dependencies={}]
   */
  constructor(dependencies = {}) {
    super()

    this.getContainer().set('foundation.app.events', dependencies['events'] || new EventManager())
    this.getContainer().set('http.routing.router', dependencies['router'] || new Router())
    this.getContainer().set('foundation.app.logger', dependencies['logger'] || new EmptyLogger())
  }

  /**
   * @protected
   * @returns {LoggerInterface}
   */
  getLogger() {
    return this.getContainer().get('foundation.app.logger')
  }

  /**
   * @protected
   * @returns {EventManager}
   */
  getEvents() {
    return this.getContainer().get('foundation.app.events')
  }

  /**
   * @protected
   * @returns {Router}
   */
  getRouter() {
    return this.getContainer().get('http.routing.router')
  }

  /**
   * @protected
   * @returns {Bag}
   */
  getOptions() {
    return this.getContainer().get('foundation.app.options')
  }

  /**
   * Start application
   * @param {Object} [options=null] Optional configuration for application
   */
  start(options = null) {
    this.getContainer().set('foundation.app.options', new Bag(typeof options === 'object' ? options : {}))
    return this.setUp()
  }

  /**
   * It runs when application is starting
   * @returns {Promise}
   */
  setUp() {
    return new Promise((resolve, reject) => {
      try {
        this.setUpEvents()
      } catch (e) {
        reject(e)
      }

      this.setUpServer()
        .then(server => {
          this.getContainer().set('foundation.app.server', server)
          resolve(server)
        })
        .catch(e => reject(e))
    })
  }

  /**
   * It runs when server is supposed to close
   */
  tearDown() {
    this.getEvents().emit('foundation.app.tearDown', {app: this})
  }

  /**
   * @protected
   */
  setUpEvents() {
    this.getEvents().emit('foundation.app.setUp', {app: this})
    this.getEvents().on('error', (args, next) => {
      this.getLogger().write(LoggerInterface.TYPE_ERROR, args.get('error').getMessage())
      next()
    })
    this.getEvents().on('http.server.ready', (args, next) => {
      this.getLogger().write(LoggerInterface.TYPE_INFO, `[info] Server is started at ${args.get('host')}:${args.get('port')}`)
      next()
    })
    this.getEvents().on('foundation.controller.action.before', (args, next) => {
      const request = args.get('request'),
            route   = args.get('route')
      this.getLogger().write(LoggerInterface.TYPE_INFO, `${request.getMethod()} ${request.getPath()} ${request.getQuery().toString()} matches ${route.getName()}`, [route.getMatches()])
      next()
    })
    this.getEvents().on('system.error', (args, next) => {
      let response    = new JsonResponse({
        message: 'Oops! There is something wrong.'
      }, Response.HTTP_INTERNAL_ERROR)
      let traces      = []
      const exception = args.get('exception')
      if (exception instanceof InternalErrorException && exception.has('request')) {
        const request = exception.get('request')
        if (request instanceof Request) {
          traces = [
            `(Request.URI) ${request.getMethod()} ${request.getPath()}`,
            `(Request.Header) ${request.getHeader().toString()}`,
            `(Request.ClientAddress) ${request.getClient().get(Request.CLIENT_HOST)}`
          ]
        }
      }
      this.getLogger().write(LoggerInterface.TYPE_ERROR, exception.getMessage(), traces)
      this.sendResponse(response, args.get('conn'))
      next()
    })
    this.getEvents().on('http.request.exception', (args, next) => {
      let response    = null
      const exception = args.get('exception')
      if (exception instanceof InternalErrorException) {
        response = new JsonResponse({
          error: {
            message: exception.getMessage()
          }
        }, Response.HTTP_INTERNAL_ERROR)
        this.getLogger().write(
          LoggerInterface.TYPE_ERROR,
          exception.getMessage(),
          [exception.getArguments().all()]
        )
      } else if (exception instanceof HttpException) {
        response = new JsonResponse({
          error: {
            code: exception.getCode(),
            message: exception.getMessage()
          }
        }, exception.getStatusCode())
      } else if (exception instanceof Error) {
        this.getLogger().write(LoggerInterface.TYPE_ERROR, exception.message)
      }

      if (response instanceof Response) {
        this.sendResponse(response, args.get('conn'))
      }
      next()
    })
  }

  /**
   * @protected
   * @returns {Promise}
   */
  setUpServer() {
    const protocol = this.getOptions().get('server.protocol', 'http')
    return protocol === 'https' ? this._setUpServerHttps() : this._setUpServerHttp()
  }

  /**
   * Set up related events handler to server
   * @param {net.Server} server
   * @private
   */
  _setUpServerEvents(server) {
    server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })
    server.on('request', (req, res) => this.handleRequest(req, res))
  }

  /**
   * Start and return HTTP server instance
   * @returns {Promise}
   * @private
   */
  _setUpServerHttp() {
    return new Promise((resolve, reject) => {
      const host    = this.getOptions().get('server.host', null)
      const port    = this.getOptions().get('server.port', 80)
      const backlog = this.getOptions().get('server.backlog', 511)
      try {
        const server = http.createServer().listen(port, host, backlog, () => {
          this._setUpServerEvents(server)
          this.getEvents().emit('http.server.ready', {
            host: host,
            port: port
          })
          resolve(server)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Start and return HTTP server instance
   * @returns {Promise}
   * @private
   */
  _setUpServerHttps() {
    return new Promise((resolve, reject) => {
      const host    = this.getOptions().get('server.host', null)
      const port    = this.getOptions().get('server.port', 443)
      const backlog = this.getOptions().get('server.backlog', 511)
      if (!this.getOptions().has('server.ssl.key') || !this.getOptions().has('server.ssl.cert')) {
        reject(new InternalErrorException('server.ssl.key and server.ssl.cert must be configured in order to use HTTPS'))
      }
      try {
        const server = https.createServer({
          key: fs.readFileSync(this.getOptions().get('server.ssl.key')),
          cert: fs.readFileSync(this.getOptions().get('server.ssl.cert'))
        }).listen(port, host, backlog, () => {
          this._setUpServerEvents(server)
          this.getEvents().emit('http.server.ready', {
            host: host,
            port: port
          })
          resolve(server)
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Handle incoming request
   * @param {http.IncomingRequest|https.IncomingRequest} req
   * @param {http.ServerResponse|https.ServerResponse} res
   * @throws {InternalErrorException} throws an exception when controller or action is not defined
   */
  handleRequest(req, res) {
    const conn     = new Connection(req, res)
    let route      = null,
          request  = null,
          response = null

    this.initRequest(conn)
      .then(r => {
        request = r
      })
      .then(() => this.routeRequest(request))
      .then(r => {
        route = r
      })
      .then(() => this.handleMiddlewares(route, request))
      .then(r => {
        if (r instanceof Response) response = r
      })
      .then(() => this.dispatchRequest(route, request, response))
      .then(r => {
        if (r instanceof Response) response = r
      })
      .then(() => this.sendResponse(response, conn))
      .then(() => this.tearDown())
      .catch(e => this.handleRequestError(e, conn, request, response))
  }

  /**
   * Initialize request
   * @protected
   * @param {Connection} conn
   * @returns {Promise}
   */
  initRequest(conn) {
    return new Promise((resolve, reject) => {
      try {
        let request = Request.from(conn.req)
        request.getUri().set(Request.URI_PROTOCOL, this.getOptions().get('server.protocol', 'http'))
        if (request.getMethod() === Request.METHOD_GET) {
          resolve(request)
        } else {
          let content = ''
          conn.req.on('data', (buffer) => {
            content += buffer.toString('utf8')
          })
          conn.req.on('end', () => {
            try {
              request.getBody().setContent(content)
              request.getBody().setContentType(request.getHeader().get(Header.CONTENT_TYPE))
              resolve(request)
            } catch (e) {
              reject(e)
            }
          })
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Route request
   * @protected
   * @param {Request} request
   * @returns {Promise}
   */
  routeRequest(request) {
    return new Promise((resolve, reject) => {
      try {
        const route = this.getRouter().route(request)
        if (route instanceof Route) {
          resolve(route)
        } else {
          reject(new NotFoundException('Sorry! There is no routes found'))
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Handle route's middlewares
   * @protected
   * @param {Route} route
   * @param {Request} request
   * @returns {Promise}
   */
  handleMiddlewares(route, request) {
    return new Promise((resolve, reject) => {
      const middlewares = route.getMiddlewares()
      let response      = null
      if (middlewares.length) {
        let tasks = []
        route.getMiddlewares().forEach(name => {
          if (!this.getRouter().getMiddlewares().has(name)) {
            return false
          }
          tasks.push(new Promise((resolve, reject) => {
            try {
              const r = this.getRouter().getMiddlewares().get(name)(route, request)
              if (r instanceof Response) {
                response = r
              }
              resolve()
            } catch (e) {
              reject(e)
            }
          }))
        })
        Promise.all(tasks)
          .then(() => resolve(response))
          .catch(e => reject(e))
      } else {
        resolve(response)
      }
    })
  }

  /**
   * Dispatch request
   * @protected
   * @param {Route} route
   * @param {Request} request
   * @param {?Response} response
   * @returns {Promise}
   * @emits foundation.controller.action.before
   */
  dispatchRequest(route, request, response) {
    return new Promise((resolve, reject) => {
      if (response instanceof Response) {
        return resolve(response)
      } else {
        response = new JsonResponse()
      }
      const controller = route.getAttributes().get('controller'),
            container  = this.getContainer()
      if (controller instanceof Controller) {
        const action = route.getAttributes().get('action')
        if (action === null || action === '' || (typeof action === 'string' && typeof controller[action] !== 'function')) {
          reject(new InternalErrorException('action is not defined in controller', null, {
            'request': request,
            'response': response,
            'route': route
          }))
        }

        controller.setContainer(container)
        controller.setRequest(request)
        controller.setResponse(response)
        controller.setRoute(route)

        let result = null
        if (typeof action === 'function') {
          result = controller.action(action, request, response, container, route)
        } else {
          result = controller[action]()
        }
        if (result instanceof Promise) {
          result.then((result) => {
            this.handleActionResult(result, controller)
            resolve(controller.getResponse())
          }).catch(e => reject(e))
        } else {
          try {
            this.handleActionResult(result, controller)
            resolve(controller.getResponse())
          } catch (e) {
            reject(e)
          }
        }
      } else {
        reject(new InternalErrorException('[foundation.App#dispatchRequest] controller is not defined or not an instance of http.Controller', null, {
          'request': request,
          'response': response,
          'route': route
        }))
      }
    })
  }

  /**
   * Handle result of controller's action
   * @protected
   * @param {*} result
   * @param {Controller} controller
   */
  handleActionResult(result, controller) {
    if (typeof result === 'object') {
      let response = controller.getResponse()
      if (response instanceof JsonResponse) {
        response.setContent(result)
      }
    } else if (result instanceof Response) {
      controller.setResponse(result)
    } else {
      throw new InternalErrorException('[foundation.App#handleActionResult] result has unexpected format')
    }
  }

  /**
   * Send response to client
   * @protected
   * @param {Response} response
   * @param {Connection} conn
   * @returns {Promise}
   * @emits http.response.send.before
   */
  sendResponse(response, conn) {
    return new Promise((resolve, reject) => {
      if (response === null || !(response instanceof Response)) {
        reject(new InternalErrorException('An appropriate response could not be found'))
      } else {
        this.getEvents()
          .emit('http.response.send.before', {
            response: response,
            conn: conn
          })
          .then(() => {
            try {
              response.send(conn.res)
              resolve(response)
            } catch (e) {
              this.getLogger().write(LoggerInterface.TYPE_ERROR, e.message)
              conn.res.end('')
            }
          })
          .catch(e => reject(e))
      }
    })
  }

  /**
   * Handle request errors
   * @protected
   * @param {Error|Exception} e
   * @param {Connection} conn
   * @param {?Request} [request=null]
   * @emits http.request.exception
   * @emits system.error
   */
  handleRequestError(e, conn, request = null, response = null) {
    if (response instanceof Response) {
      this.sendResponse(response, conn)
    } else if (e instanceof Exception) {
      this.getEvents().emit('http.request.exception', {
        exception: e,
        conn: conn
      })
    } else if (e instanceof Error) {
      this.getEvents().emit('system.error', {
        exception: new InternalErrorException(e.message, null, {
          request: request
        }),
        conn: conn
      })
    }
  }

  /**
   * Stop application
   * @returns {Promise}
   */
  stop() {
    return new Promise((resolve, reject) => {
      if (this.getContainer().has('foundation.app.server')) {
        try {
          this.getContainer().get('foundation.app.server').close(resolve)
          this.getContainer().remove('foundation.app.server')
          this.tearDown()
        } catch (e) {
          reject(e)
        }
      } else {
        resolve()
      }
    })
  }

  /**
   * Restart application
   * @returns {Promise.<TResult>}
   */
  restart() {
    return this.stop().then(this.start)
  }
}
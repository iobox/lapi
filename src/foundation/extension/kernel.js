import Bag from '../bag'
import Exception from '../../exception'
import Header from '../../http/header'
import Controller from '../../http/controller'
import ModuleExtension from './module'
import Request from '../../http/request'
import Response from '../../http/response'
import Route from '../../http/routing/route'
import Router from '../../http/routing/router'
import InternalErrorException from '../../exception/internal-error'
import FileLogger from '../../logger/file'
import LoggerInterface from '../../logger/interface'
import HttpException from '../../http/exception/http'
import NotFoundException from '../../http/exception/not-found'
import EventManager from '../../event/manager'
import ConsoleLogger from '../../logger/console'
import JsonResponse from '../../http/response/json'

const http = require('http')
const https = require('https')
const fs = require('fs')

/**
 * Contain information about original request, response
 */
class Connection {
  constructor(req, res) {
    this.req = req
    this.res = res
  }
}

export default class KernelExtension extends ModuleExtension {
  getName() {
    return 'foundation.extension.module.system'
  }

  /**
   * To set up some common objects, such as db, controller, request, response
   */
  setUp() {
    this.setUpEvents()
      .then(this.setUpLogger())
      .then(this.setUpRouter())
      .then(this.setUpServer())
      .catch(e => this.handleSetUpError(e))
  }

  /**
   * Get application's options
   * @returns {Bag}
   * @throws {Error} throws an error if application's options is not an instance of Bag
   */
  getOptions() {
    let options = this.getContainer().get('app.options')
    if (options instanceof Bag) {
      return options
    } else {
      throw new Error('[Foundation/Extension/SystemExtension#getOptions] application\'s options must be an instance of Bag')
    }
  }

  /**
   * Get events manager
   * @returns {EventManager}
   */
  getEvents() {
    const events = this.getContainer().get('events')
    if (events instanceof EventManager) {
      return events
    } else {
      throw new Error('[Foundation/Extension/SystemExtension#getEvents] events must be an instance of Event/EventManager')
    }
  }

  /**
   * Get logger
   * @returns {LoggerInterface}
   */
  getLogger() {
    const logger = this.getContainer().get('logger')
    if (logger instanceof LoggerInterface) {
      return logger
    } else {
      throw new Error('[Foundation/Extension/SystemExtension#getLogger] logger must be an instance of Logger/LoggerInterface')
    }
  }

  /**
   * Set up events
   */
  setUpEvents() {
    return new Promise((resolve, reject) => {
      try {
        let events = new EventManager()
        const self = this
        events.on('error', (event) => {
          self.getLogger().write(LoggerInterface.TYPE_ERROR, event.error.message)
        })
        events.on('http.server.ready', (args, next) => {
          console.log(`[info] Server is started at ${args.get('host')}:${args.get('port')}`)
          next()
        })

        this.getContainer().set('events', events)
        resolve(events)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * Set up application's logger
   */
  setUpLogger() {
    return new Promise((resolve, reject) => {
      let logger = null
      const driver = this.getOptions().get('logger.driver', null)
      if (driver) {
        const options = this.getOptions().get('logger.options', null)
        switch (driver) {
          case 'file':
            logger = new FileLogger(options)
            break
          case 'console':
            logger = new ConsoleLogger(options)
            break
          default:
            reject(new InternalErrorException('Invalid logger driver'))
            break
        }
      }
      if (logger instanceof LoggerInterface) {
        this.getContainer().set('logger', logger)
      } else {
        this.getContainer().set('logger', new LoggerInterface())
      }
      resolve(logger)
    })
  }

  /**
   * Set up application's router
   */
  setUpRouter() {
    return new Promise((resolve, reject) => {
      try {
        const routes = this.getOptions().get('routes', []),
              router = new Router(routes)
        this.getContainer().set('http.router', router)
        resolve(router)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * @emits http.request emits an event "http.request" when receiving an incoming request
   */
  setUpServer() {
    return new Promise((resolve, reject) => {
      const protocol = this.getOptions().get('server.protocol', 'http')
      let server = null
      try {
        if (protocol === 'https') {
          // set up HTTPS server
          server = this._setUpServerHttps()
        } else {
          // set up HTTP server
          server = this._setUpServerHttp()
        }
      } catch (e) {
        reject(e)
      }

      if (server) {
        server.on('clientError', (err, socket) => {
          socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
        })
        server.on('request', (req, res) => this.handleRequest(req, res))
        this.bindEvents()
        resolve(server)
      } else {
        reject(new InternalErrorException('Unable to set up a server'))
      }
    })
  }

  /**
   * Start and return HTTP server instance
   * @returns {http.Server}
   * @private
   */
  _setUpServerHttp() {
    const host = this.getOptions().get('server.host', null)
    const port = this.getOptions().get('server.port', 80)
    const backlog = this.getOptions().get('server.backlog', 511)
    return http.createServer()
               .listen(port, host, backlog, () => {
                 this.getEvents().emit('http.server.ready', {
                   host: host,
                   port: port
                 })
               })
  }

  /**
   * Start and return HTTP server instance
   * @returns {https.Server}
   * @private
   */
  _setUpServerHttps() {
    const host = this.getOptions().get('server.host', null)
    const port = this.getOptions().get('server.port', 443)
    const backlog = this.getOptions().get('server.backlog', 511)
    if (!this.getOptions().has('server.ssl.key') || !this.getOptions().has('server.ssl.cert')) {
      throw new InternalErrorException('server.ssl.key and server.ssl.cert must be configured in order to use HTTPS')
    }
    return https.createServer({
                  key: fs.readFileSync(this.getOptions().get('server.ssl.key')),
                  cert: fs.readFileSync(this.getOptions().get('server.ssl.cert'))
                })
                .listen(port, host, backlog, () => {
                  this.getEvents().emit('http.server.ready', {
                    host: host,
                    port: port
                  })
                })
  }

  handleSetUpError(e) {
    const logger = new ConsoleLogger()
    if (e instanceof Exception) {
      logger.write(LoggerInterface.TYPE_ERROR, e.getMessage())
    } else {
      logger.write(LoggerInterface.TYPE_ERROR, e.message)
    }
  }

  /**
   * Handle incoming request
   * @param {http.IncomingRequest|https.IncomingRequest} req
   * @param {http.ServerResponse|https.ServerResponse} res
   * @throws {InternalErrorException} throws an exception when controller or action is not defined
   */
  handleRequest(req, res) {
    const conn  = new Connection(req, res)
    let request = null

    this.initRequest(conn)
      .then((req) => {
        request = req
        return this.routeRequest(request)
      })
      .then((route) => this.dispatchRequest(route, request))
      .then((response) => this.sendResponse(response, conn))
      .catch((e) => this.handleRequestError(e, conn, request))
  }

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
   * @param {Request} request
   * @returns {Promise}
   */
  routeRequest(request) {
    return new Promise((resolve, reject) => {
      try {
        const router = this.getContainer().get('http.router'),
              route  = router.route(request)

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
   * Dispatch request
   * @param {Route} route
   * @param {Request} request
   * @returns {Promise}
   * @emits foundation.controller.action.before
   */
  dispatchRequest(route, request) {
    return new Promise((resolve, reject) => {
      let response = new JsonResponse()
      const controller = route.getOptions().get('controller')
      if (controller instanceof Controller) {
        const action = route.getOptions().get('action')
        if (action === null || action === '' || (typeof action === 'string' && typeof controller[action] !== 'function')) {
          reject(new InternalErrorException('action is not defined in controller', null, {
            'request': request,
            'response': response,
            'route': route
          }))
        }

        controller.setContainer(this.getContainer())
        controller.setRequest(request)
        controller.setResponse(response)
        controller.setRoute(route)

        this.getEvents()
            .emit('foundation.controller.action.before', {
              controller: controller,
              action: action,
              request: request,
              route: route
            })
            .then(() => {
              let result = null
              if (typeof action === 'function') {
                result = controller.action(action)
              } else {
                result = controller[action]()
              }
              if (result instanceof Promise) {
                result.then((result) => {
                  this.handleActionResult(result, controller)
                  resolve(controller.getResponse())
                }).catch((e) => {
                  reject(e)
                })
              } else {
                this.handleActionResult(result, controller)
                resolve(controller.getResponse())
              }
            })
            .catch(reject)
      } else {
        reject(new InternalErrorException('[Foundation/Extension/SystemExtension#dispatchRequest] controller is not defined or not an instance of Foundation/Controller', null, {
          'request': request,
          'response': response,
          'route': route
        }))
      }
    })
  }

  /**
   * Handle result of controller's action
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
      throw new InternalErrorException('[Foundation/Extension/SystemExtension#handleActionResult] result has unexpected format')
    }
  }

  /**
   * Send response to client
   * @param {Response} response
   * @param {Connection} conn
   * @returns {Promise}
   * @emits {string} emits event "http.response.send.before"
   */
  sendResponse(response, conn) {
    return new Promise((resolve, reject) => {
      this.getEvents()
        .emit('http.response.send.before', {
          response: response,
          conn: conn
        })
        .then(() => {
          try {
            response.send(conn.res)
            resolve(response)
          } catch(e) {
            this.getLogger().write(LoggerInterface.TYPE_ERROR, e.message)
            conn.res.end('')
          }
        })
        .catch(e => reject(e))
    })
  }

  /**
   * Handle request errors
   * @param {Error|Exception} e
   * @param {Connection} conn
   * @param {?Request} [request=null]
   * @emits http.request.exception
   * @emits system.error
   */
  handleRequestError(e, conn, request = null) {
    if (e instanceof Exception) {
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
   * Bind events
   * @listens foundation.controller.action.before
   * @listens system.error
   * @listens http.request.exception
   */
  bindEvents() {
    this.getEvents().on('foundation.controller.action.before', (args, next) => {
      const request = args.get('request'),
            route   = args.get('route')
      this.getLogger().write(LoggerInterface.TYPE_INFO, `${request.getMethod()} ${request.getPath()} ${request.getQuery().toString()} matches ${route.getName()}`, [route.getMatches()])
      next()
    })
    this.getEvents().on('system.error', (args, next) => {
      let response = new JsonResponse({
        message: 'Oops! There is something wrong.'
      }, Response.HTTP_INTERNAL_ERROR)
      let traces = []
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
      let response = null
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
}
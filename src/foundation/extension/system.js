import Bag from '../bag'
import Body from '../../http/body'
import Exception from '../exception'
import Header from '../../http/header'
import Controller from '../controller'
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
import Event from '../../event/event'

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

class ServerReadyEvent extends Event {
  constructor(host, port) {
    super('http.server.ready', true)
    this.host = host
    this.port = port
  }
}

class UnexpectedErrorEvent extends Event {
  constructor(error) {
    super('error', true)
    this.error = error
  }
}

class BeforeActionEvent extends Event {
  /**
   * Constructor
   * @param {Controller} controller
   */
  constructor(controller, action) {
    super('foundation.controller.action.before')
    this.controller = controller
    this.action = action
  }
}

class BeforeSendResponseEvent extends Event {
  /**
   * Constructor
   * @param {Response} response
   * @param {Connection} conn
   */
  constructor(response, conn) {
    super('http.response.send.before')
    this.response = response
    this.conn = conn
  }
}

class AfterSendResponseEvent extends Event {
  constructor() {
    super('http.response.send.after', true)
  }
}

class SystemErrorEvent extends Event {
  constructor(error, conn) {
    super('system.error', true)
    this.error = error
    this.conn = conn
  }
}

class IncomingRequestExceptionEvent extends Event {
  constructor(exception, conn) {
    super('http.request.exception')
    this.exception = exception
    this.conn = conn
  }
}

export default class SystemExtension extends ModuleExtension {
  /**
   * To set up some common objects, such as db, controller, request, response
   */
  setUp() {
    this.setUpEvents()
    this.setUpLogger()
    this.setUpRouter()
    this.setUpServer()
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
    let events = new EventManager()
    const self = this
    events.on('error', (event) => {
      self.getLogger().write(LoggerInterface.TYPE_ERROR, event.error.message)
    })
    events.on('http.server.ready', (event) => {
      console.log(`[info] Server is started at ${event.host}:${event.port}`)
    })

    this.getContainer().set('events', events)
  }

  /**
   * Set up application's logger
   */
  setUpLogger() {
    let logger = null
    const driver = this.getOptions().get('logger.driver', null)
    if (driver) {
      const options = this.getOptions().get('logger.options', null)
      switch (driver) {
        case 'file':
          logger = new FileLogger(options)
          break
        default:
          break
      }
    }
    if (logger instanceof LoggerInterface) {
      this.getContainer().set('logger', logger)
    } else {
      this.getContainer().set('logger', new LoggerInterface())
    }
  }

  /**
   * Set up application's router
   */
  setUpRouter() {
    const routes = this.getOptions().get('routes', [])
    this.getContainer().set('http.router', new Router(routes))
  }

  /**
   * @emits http.request emits an event "http.request" when receiving an incoming request
   */
  setUpServer() {
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
      this.getLogger().write(LoggerInterface.TYPE_ERROR, e.message)
    }

    if (server) {
      server.on('clientError', (err, socket) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
      })
      server.on('request', (req, res) => this.handleIncomingRequest(req, res))
      this.handleOutgoingResponse()
    }
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
                 this.getEvents().emit(new ServerReadyEvent(host, port))
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
                  this.getEvents().emit(new ServerReadyEvent(host, port))
                })
  }

  /**
   * Handle incoming request
   * @param {http.IncomingRequest|https.IncomingRequest} req
   * @param {http.ServerResponse|https.ServerResponse} res
   * @throws {InternalErrorException} throws an exception when controller or action is not defined
   *
   * @emits http.request.before emits an event before performing controller's action
   * @emits http.request.after emits an event after performing controller's action
   * @emits http.response.send emits an event to send response if there is no errors
   * @emits http.request.not_found emits an event when no matched routes is found
   * @emits http.request.exception emits an event when an exception is thrown
   * @emits system.error emits an event when there is an unexpected error
   */
  handleIncomingRequest(req, res) {
    this.conn    = new Connection(req, res)
    this.request = null
    this.makeRequest(this.conn)
        .then((request) => {
          this.request = request
          return this.routeRequest(request)
        })
        .then((route) => this.dispatchRequest(route, this.request))
        .then((response) => this.sendResponse(response, this.conn))
        .catch((e) => this.handleError(e, this.conn))
  }

  /**
   * Make new request from resource
   * @param {Connection} conn
   * @returns {Promise}
   */
  makeRequest(conn) {
    return new Promise((resolve, reject) => {
      try {
        let request = Request.from(conn.req)
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
      const router = this.getContainer().get('http.router'),
            route  = router.route(request)

      if (route instanceof Route) {
        resolve(route)
      } else {
        reject(new NotFoundException('Sorry! There is no routes found'))
      }
    })
  }

  /**
   * Dispatch request
   * @param {Route} route
   * @param {Request} request
   * @returns {Promise}
   */
  dispatchRequest(route, request) {
    return new Promise((resolve, reject) => {
      let response = new Response()
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

        const onBeforeActionEventEmitted = (event) => {
          let result = null,
              controller = event.controller,
              action = event.action
          try {
            if (typeof action === 'function') {
              result = controller.execute(action)
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
          } catch (e) {
            reject(e)
          }
        }

        this.getEvents()
            .emit(new BeforeActionEvent(controller, action), onBeforeActionEventEmitted)
      } else {
        reject(new InternalErrorException('controller is not defined or not an instance of Foundation/Controller', null, {
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
      if (response instanceof Response) {
        response.getBody().setContent(JSON.stringify(result))
        response.getBody().setContentType(Body.CONTENT_JSON)
      }
    } else if (result instanceof Response) {
      controller.setResponse(result)
    } else {
      throw new InternalErrorException('[Foundation/Extension/SystemExtension#handleActionResult] result has unexpected format')
    }
  }

  /**
   * Send response
   * @param {Response} response
   * @param {Connection} conn
   * @returns {Promise}
   */
  sendResponse(response, conn) {
    return new Promise((resolve, reject) => {
      this.getEvents()
        .emit(new BeforeSendResponseEvent(response, conn), (event) => {
          try {
            event.response.send(event.conn.res)
            resolve(event.response)
          } catch (e) {
            reject(e)
          }
        })
    })
  }

  /**
   * Handle errors
   * @param {Error|Exception} e
   * @param {Connection} conn
   * @param {?Request} [request=null]
   */
  handleError(e, conn, request = null) {
    if (e instanceof Exception) {
      this.getEvents().emit(new IncomingRequestExceptionEvent(e, conn))
    } else if (e instanceof Error) {
      this.getEvents().emit(new SystemErrorEvent(new InternalErrorException(e.message, null, {
        request: request
      }), conn))
    }
  }

  /**
   * Handle outgoing response
   * @listens {SystemErrorEvent} listens for any errors
   * @listens {IncomingRequestExceptionEvent} listens for exception from handling request
   */
  handleOutgoingResponse() {
    this.getEvents().on('system.error', (event, done) => {
      let response = new Response({
        message: 'Oops! There is something wrong.'
      }, Response.HTTP_INTERNAL_ERROR)
      let traces = []
      if (event.error instanceof InternalErrorException && event.error.has('request')) {
        const request = event.error.get('request')
        if (request instanceof Request) {
          traces = [
            `[trace] (Request.URI) ${request.getMethod()} ${request.getPath()}`,
            `[trace] (Request.Header) ${request.getHeader().toString()}`,
            `[trace] (Request.ClientAddress) ${request.getClient().get(Request.CLIENT_HOST)}`
          ]
        }
      }
      this.getLogger().write(LoggerInterface.TYPE_ERROR, event.error.message, traces)
      this.sendResponse(response, event.conn)
      done()
    })
    this.getEvents().on('http.request.exception', (event, done) => {
      let response = null
      if (event.exception instanceof InternalErrorException) {
        response = new Response({
          error: {
            message: event.exception.getMessage()
          }
        }, Response.HTTP_INTERNAL_ERROR)
        this.getLogger().write(LoggerInterface.TYPE_ERROR, event.exception.getMessage(), [JSON.stringify(event.exception.getArguments().all())])
      } else if (event.exception instanceof HttpException) {
        response = new Response({
          error: {
            code: event.exception.getCode(),
            message: event.exception.getMessage()
          }
        }, event.exception.getStatusCode())
      } else if (event.exception instanceof Error) {
        this.getLogger().write(LoggerInterface.TYPE_ERROR, event.exception.getMessage())
      }

      if (response instanceof Response) {
        this.sendResponse(response, event.conn)
      }
      done()
    })
  }
}
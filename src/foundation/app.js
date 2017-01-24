import Bag from './bag'
import ContainerAware from '../di/container-aware'
import Container from '../di/container'
import Router from '../http/routing/router'
import ModuleExtension from './extension/module'
import ExtensionManager from './extension/manager'
import Extension from './extension'
import EventManager from '../event/manager'
import EmptyLogger from '../logger/empty'
import LoggerInterface from '../logger/interface'
import Request from '../http/request'
import Header from '../http/header'
import Route from '../http/routing/route'
import Controller from '../http/controller'
import JsonResponse from '../http/response/json'
import Response from '../http/response'
import Exception from '../exception'
import HttpException from '../http/exception/http'
import InternalErrorException from '../exception/internal-error'
import InvalidArgumentException from '../exception/invalid-argument'
import NotFoundException from '../http/exception/not-found'

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

export default class App extends ContainerAware {
  /**
   * Constructor
   * @param {Container} [container=null]
   */
  constructor(container = null) {
    super(container)

    /**
     * Internal Extension Manager
     * @type {ExtensionManager}
     * @private
     */
    this._extensionManager = new ExtensionManager()
  }

  /**
   * Get Extension Manager
   * @returns {ExtensionManager}
   */
  getExtensionManager() {
    return this._extensionManager
  }

  /**
   * Extend application with extension
   * @param {Extension} extension
   */
  extend(extension) {
    this.getExtensionManager().extend(extension)
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
   * Run application
   * @param {Object} [options=null] Optional configuration for application
   */
  run(options = null) {
    let container = this.getContainer()
    container.set('foundation.app.events', new EventManager())
    container.set('http.routing.router', new Router())
    container.set('foundation.app.options', new Bag(typeof options === 'object' ? options : {}))
    container.set('foundation.app.logger', new EmptyLogger())

    try {
      this.setUpExtensions()
      this.setUpEvents()
      this.setUpServers()
    } catch (e) {
      this.getLogger().write(LoggerInterface.TYPE_ERROR, e.message)
    }
  }

  /**
   * @protected
   */
  setUpExtensions() {
    const container = this.getContainer()
    for (let extension of this.getExtensionManager().getExtensions()) {
      if (extension instanceof Extension) {
        extension.setContainer(container)
      }
      if (extension instanceof ModuleExtension) {
        extension.setUp()
      }
    }
  }

  /**
   * @protected
   */
  setUpEvents() {
    this.getEvents().on('error', (args, next) => {
      this.getLogger().write(LoggerInterface.TYPE_ERROR, args.get('error').getMessage())
      next()
    })
    this.getEvents().on('http.server.ready', (args, next) => {
      console.log(`[info] Server is started at ${args.get('host')}:${args.get('port')}`)
      next()
    })
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

  /**
   * @protected
   */
  setUpServers() {
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
      this.getEvents().emit('error', {
        error: new InternalErrorException(e.message)
      })
      return false
    }

    if (server) {
      server.on('clientError', (err, socket) => {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
      })
      server.on('request', (req, res) => this.handleRequest(req, res))
    } else {
      this.getEvents().emit('error', {
        error: new InternalErrorException('Unable to set up a server')
      })
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
   * Dispatch request
   * @protected
   * @param {Route} route
   * @param {Request} request
   * @returns {Promise}
   * @emits foundation.controller.action.before
   */
  dispatchRequest(route, request) {
    return new Promise((resolve, reject) => {
      let response = new JsonResponse()
      const controller = route.getAttributes().get('controller')
      if (controller instanceof Controller) {
        const action = route.getAttributes().get('action')
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
   * @protected
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
}
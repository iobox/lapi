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

const EventEmitter = require('events')
const http = require('http')
const https = require('https')

export default class SystemExtension extends ModuleExtension {
  /**
   * To set up some common objects, such as db, controller, request, response
   */
  setUp() {
    this.getContainer().set('events', new EventEmitter())

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
      throw new Error('[Foundation/Extension/System#getOptions] application\'s options must be an instance of Bag')
    }
  }

  /**
   * Get events manager
   * @returns {EventEmitter}
   */
  getEvents() {
    const events = this.getContainer().get('events')
    if (events instanceof EventEmitter) {
      return events
    } else {
      throw new Error('[Foundation/Extension/System#getEvents] events must be an instance of EventEmitter')
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
      throw new Error('[Foundation/Extension/System#getLogger] logger must be an instance of LoggerInterface')
    }
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
      console.log(e.message)
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
    return http.createServer()
               .listen(port, host)
  }

  /**
   * Start and return HTTP server instance
   * @returns {https.Server}
   * @private
   */
  _setUpServerHttps() {

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
    try {
      let request = Request.from(req),
          response = new Response(),
          router = this.getContainer().get('http.router'),
          route  = router.route(request)

      if (route instanceof Route) {
        const controller = route.getOptions().get('controller')
        if (controller instanceof Controller) {
          const action = route.getOptions().get('action')
          if (action === null || action === '' || typeof controller[action] !== 'function') {
            throw new InternalErrorException('action is not defined in controller', null, {
              'request': request,
              'response': response,
              'route': route
            })
          }

          controller.setContainer(this.getContainer())
          controller.setRequest(request)
          controller.setResponse(response)
          controller.setRoute(route)

          this.getEvents().emit('http.request.before', controller)
          const content = controller[action]()
          this.getEvents().emit('http.request.after', content, controller)
          this.getEvents().emit('http.response.send', response, res)
        } else if (typeof controller === 'function') {
          const content = controller(request, response, route, this.getContainer())
          this.getEvents().emit('http.request.after', content, response)
          this.getEvents().emit('http.response.send', response, res)
        } else {
          throw new InternalErrorException('controller is not defined or not an instance of Foundation/Controller', null, {
            'request': request,
            'response': response,
            'route': route
          })
        }
      } else {
        throw new NotFoundException('Sorry! There is no routes found')
      }
    } catch (e) {
      if (e instanceof Exception) {
        this.getEvents().emit('http.request.exception', e, res)
      } else if (e instanceof Error) {
        this.getEvents().emit('system.error', res, e)
      }
    }
  }

  /**
   * Handle outgoing response
   * @listens http.response.send listens for sending outgoing response event
   * @listens http.request.not_found listens for exception when there is no matched routes
   * @listens http.request.exception listens for exception from handling request
   * @listens http.request.after listens for result after perform controller's action
   */
  handleOutgoingResponse() {
    this.getEvents().on('http.response.send', (response, res) => {
      if (response instanceof Response) {
        response.send(res)
      }
    })
    this.getEvents().on('system.error', (response, res) => {
      if (response instanceof Response) {
        response.send(res)
      }
    })
    this.getEvents().on('http.request.exception', (e, res) => {
      let response = null
      if (e instanceof InternalErrorException) {
        response = new Response({
          error: {
            message: e.getMessage()
          }
        }, Response.HTTP_INTERNAL_ERROR)
        this.getLogger().write(LoggerInterface.TYPE_ERROR, e.getMessage(), [JSON.stringify(e.getArguments().all())])
      } else if (e instanceof HttpException) {
        response = new Response({
          error: {
            code: e.getCode(),
            message: e.getMessage()
          }
        }, e.getStatusCode())
      } else if (e instanceof Error) {
        this.getLogger().write(LoggerInterface.TYPE_ERROR, e.getMessage())
      }
      if (response instanceof Response) {
        this.getEvents().emit('http.response.send', response, res)
      }
    })
    this.getEvents().on('http.request.after', (content, controller) => {
      if (typeof content !== 'object') {
        return false
      }
      let response = null
      if (controller instanceof Controller) {
        response = controller.getResponse()
      } else if (controller instanceof Response) {
        response = controller
      }

      if (response instanceof Response) {
        response.getBody().setContent(JSON.stringify(content))
        response.getBody().setContentType(Body.CONTENT_JSON)
        response.getHeader().set(Header.CONTENT_TYPE, Body.CONTENT_JSON)
      }
    })
  }
}
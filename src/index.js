import App from './app'
import ConsoleLogger from './logger/console'
import JsonResponse from './http/response/json'
import Controller from './http/controller'
import ModuleExtension from './foundation/extension/module'
import LoggerInterface from './logger/interface'
class BlogExtension extends ModuleExtension {
  getName() {
    return 'module.blog'  
  }
  
  setUp() {
    var events = this.getContainer().get('foundation.app.events')
    events.on('http.server.ready', (args, next) => {
      console.log('Blog extension is ready!')
      next()
    })
  }
}
const app = new App(),
      container = app.getContainer()
app.extend(new BlogExtension())
app.start({
  'server.port': 8080
})
  .then(() => {
    app.getLogger().write(LoggerInterface.TYPE_INFO, 'Application has been started successfully.')
  })
  .catch(e => {
    app.getLogger().write(LoggerInterface.TYPE_ERROR, e.message)
  })
container.set('foundation.app.logger', new ConsoleLogger())

app.use('auth', (route, request) => {
  return new JsonResponse({
    error: "Authentication is required"
  })
})

class BlogController extends Controller {
  getItemAction() {
    return {
      data: {
        id: 1,
        title: "Some blog title"
      }
    }
  }
}
const router = app.getRouter()
router.get('/hello/world').handler(function() {
  return {
    data: {
      say: "Hello World!",
      isAuthenticated: this.getRequest().get('isAuthenticated')
    }
  }
}).middleware(['auth'])
router.group((router) => {
  router.get('/users/{id}').require({id: /\d+/}).handler(function(request) {
    return {
      data: {
        id: request.get('id'),
        name: "Long Do"
      }
    }
  }).middleware(['isMale'])
}).prefix('/v1').middleware(['v1'])
router.get('/blogs/{id}').require({id: /\d+/}).handler(new BlogController(), 'getItemAction')

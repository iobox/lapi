# lapi
Light API framework for NodeJS

[![Build Status](https://travis-ci.org/iobox/lapi.svg)](https://travis-ci.org/dotronglong/codepack)

Provide a lot of small classes to quickly build up a website with NodeJS

## API Reference
Check out at [here](https://lapi-iobox.herokuapp.com)

## Getting started
- Get the framework ready
```
npm install --save lapi
```
- Create a file, for instance, `index.js` with following contents:
```
var App = require('lapi').App
var app = new App()
app.start({
  'server.port': 8080
})

// Define routes here
var router = app.getRouter()
router.get('/hello/world').handler(function() {
  return {
    data: {
      say: "Hello World!"
    }
  }
})
```
- Then, let's access to URL `http://localhost:8080/hello/world`
- The response should be
```
{
  "data": {
    "say": "Hello World!"
  }
}
```

## Middleware
Middleware is a way to manipulate request before action actually runs

- Add some attributes to request
```
app.use('auth', (route, request) => {
  request.set('isAuthenticated', request.getHeader().has('X-TOKEN'))
})

var router = app.getRouter()
router.get('/hello/world').handler(function() {
  return {
    data: {
      say: "Hello World!",
      auth: this.getRequest().get('isAuthenticated')
    }
  }
})
```

- Send out a customized response
```
var JsonResponse = require('lapi').http.response.JsonResponse
app.use('auth', () => {
  return new JsonResponse({
    error: "Authentication is required"
  })
})
```

## Extension
First of all, extension is a way to get primary `Container` object of application.

In addition, if an extension is a sub class of `foundation.extension.ModuleExtension`, it will has ability to extend a lot of more features from application by invoking 2 main phases `setUp` and `tearDown`.
- Phase `setUp` allows extension to add more routes, event's listeners
- Phase `tearDown` which is called after response is sent, it would be a great choice to clean resources, such as database connection

Examples:
- Add routes
```
class BlogExtension extends ModuleExtension {
  getName() {
    return 'module.blog'
  }

  setUp() {
    var router = this.getContainer().get('http.routing.router')
    router.get('/blogs').handler(function() {
      return [
        {
          id: 1,
          title: "Some blog"
        }
      ]
    })
  }
}

const app = new App()
app.extend(new BlogExtension())
app.start({
  'server.port': 8080
})
```
- Register event's listeners
```
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

const app = new App()
app.extend(new BlogExtension())
app.start({
  'server.port': 8080
})
```

## Controller
If you are a fan of MVC model, you would think that it would be nice to have a Controller instead of function
```
var Controller = require('lapi').http.Controller
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

router.get('/blogs/{id}').require({id: /\d+/}).handler(new BlogController(), 'getItemAction')
```

## Request
- To set / get an attribute to request
```
router.get('/blogs/{id}').require({id: /\d+/}).handler(function() {
  this.getRequest().set('some-attribute', 'some-value')
  return {
    "data": this.getRequest().get('some-attribute')
  }
})
```
- To get content of request's body
```
router.post('/blogs/{id}').require({id: /\d+/}).handler(function() {
  console.log(this.getRequest().getBody().getParsedContent())
})
```

## Routing
- Common methods is available
```
router.get(/* path */)
router.post(/* path */)
router.put(/* path */)
router.patch(/* path */)
router.delete(/* path */)
```
- Path's requirements
```
router.get(/* path */).require({ /* requirements */})
```
- Additional attributes
```
router.get(/* path */).with({ /* attributes */})
```
- Middlewares
```
router.get(/* path */).middleware(['auth'])
```
- Group of routes
```
router.group((router) => {
  router.get(/* path */) // path is /v1/path, middleware is auth
  router.get(/* other-path */).middleware(['new']) // path is /v1/other-path, middlewares are auth, new
}).prefix('/v1').middleware(['auth'])
```
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

## Testing
It is always a must to test your application so as to make sure you are welcome for changes.
Here are some steps to set up functional tests with `lapi`
- Setup Application and API
```
const app = new App()
const api = new Api({
  host: 'localhost',
  port: 6767
})
```
- Single request
```
app.use('auth', (route, request) => {
    return new JsonResponse({
      error: "Authentication is required"
    }, 400)
  })
app.start({'server.port': 6767}).then(() => {
    app.getRouter().get('/hello').middleware(['auth'])
    api.get('/hello').then(spec => {
      spec.hasHeaderKeyValue('content-type', 'application/json')
      spec.hasBodyParsedContent({
        error: "Authentication is required"
      })
    spec.hasStatusCode(400)
    done()
  }).catch(e => done(e))
})
```
- Multiple requests
```
app.start({'server.port': 6767}).then(() => {
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
```
- Remember to stop application for each tests
```
afterEach(() => {
  if (app instanceof App) {
    app.stop()
  }
})
```
### Extending Tests
You might need to check more in response in order to assure that response is exactly as expectation.
You should extend the `Spec` class.
```
// my.spec.js
var Api = require('lapi').test.Api
var Spec = require('lapi').test.Spec
var assert = require('assert')

export default class MySpec extends Spec {
  constructor() {
    super()
  }

  hasSomeValue(value) {
    assert.equal(true, value)
  }
}
Api.Spec = MySpec // Mark it as default Spec

// my.test.js
app.start({'server.port': 6767}).then(() => {
    app.getRouter().get('/hello')
    api.get('/hello').then(spec => {
      spec.hasSomeValue('my-value')
      done()
  }).catch(e => done(e))
})
```